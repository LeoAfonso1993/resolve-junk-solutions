import { track } from './analytics';
import { submitLead, validatePhotos } from './leads';
import { intakeOptions } from '../data/intake';
const form = document.querySelector<HTMLFormElement>('#quote-form');
if (form) {
  const panels = Array.from(
    form.querySelectorAll<HTMLFieldSetElement>('[data-step]'),
  );
  const next = form.querySelector<HTMLButtonElement>('#next-step')!;
  const back = form.querySelector<HTMLButtonElement>('#previous-step')!;
  const status = form.querySelector<HTMLElement>('#form-status')!;
  const input = (id: string) => form.querySelector<HTMLInputElement>(`#${id}`)!;
  const photos = input('photos');
  const phone = input('phone');
  const email = input('email');
  const labels = [
    'Your location',
    'Your items',
    'Timing & access',
    'Contact details',
    'Review your request',
  ];
  let step = 0,
    pending = false,
    started = false;
  const requestId = crypto.randomUUID();
  let photoUrls: string[] = [];
  form.querySelector<HTMLInputElement>('[name=startedAt]')!.value = String(
    Date.now(),
  );
  const params = new URLSearchParams(location.search);
  const initialZip = params.get('zip');
  if (initialZip && /^\d{5}$/.test(initialZip)) input('zip').value = initialZip;
  const labelFor = (group: keyof typeof intakeOptions, value: string) =>
    intakeOptions[group].find((o) => o[0] === value)?.[1] || value;
  const values = () => new FormData(form);
  function review() {
    const data = values();
    const target = document.querySelector('#review-summary')!;
    target.replaceChildren();
    const rows = [
      ['Location', String(data.get('zip')), 0],
      [
        'Items',
        data
          .getAll('categories')
          .map((v) => labelFor('services', String(v)))
          .join(', '),
        1,
      ],
      ['Amount', labelFor('volumes', String(data.get('volume'))), 1],
      ['Description', String(data.get('items')), 1],
      ['Photos', `${photos.files?.length || 0} attached`, 1],
      ['Timing', labelFor('timeframes', String(data.get('timeframe'))), 2],
      ['Access', labelFor('access', String(data.get('access'))), 2],
      ['Property', labelFor('properties', String(data.get('propertyType'))), 2],
      ['Notes', String(data.get('notes') || 'None added'), 2],
      [
        'Contact',
        [data.get('name'), data.get('phone'), data.get('email')]
          .filter(Boolean)
          .join(' · '),
        3,
      ],
      ['Contact preference', String(data.get('contactPreference')), 3],
      ['Street address', String(data.get('address') || 'To be confirmed'), 3],
    ];
    for (const [label, value, index] of rows) {
      const row = document.createElement('div');
      const text = document.createElement('div');
      const title = document.createElement('strong');
      title.textContent = String(label);
      const body = document.createElement('p');
      body.textContent = String(value);
      const edit = document.createElement('button');
      edit.type = 'button';
      edit.textContent = 'Edit';
      edit.setAttribute('aria-label', `Edit ${label}`);
      edit.addEventListener('click', () => show(Number(index)));
      text.append(title, body);
      row.append(text, edit);
      target.append(row);
    }
  }
  function show(index: number, focus = true) {
    if (pending) return;
    document.querySelector('#step-error')!.textContent = '';
    step = index;
    panels.forEach((p, i) => (p.hidden = i !== step));
    back.hidden = step === 0;
    document.querySelector('#step-counter')!.textContent =
      `STEP ${step + 1} OF 5`;
    document.querySelector('#step-label')!.textContent = labels[step];
    (document.querySelector('#progress-fill') as HTMLElement).style.width =
      `${(step + 1) * 20}%`;
    next.textContent =
      step === 4
        ? form!.dataset.endpoint
          ? 'Send My Request →'
          : 'Online Sending Opens Soon'
        : 'Continue →';
    next.disabled = step === 4 && !form!.dataset.endpoint;
    status.textContent = '';
    if (step === 4) review();
    if (focus) {
      const heading = panels[step].querySelector('legend')!;
      heading.tabIndex = -1;
      heading.focus();
      document.querySelector('.quote-shell')?.scrollIntoView({
        behavior: matchMedia('(prefers-reduced-motion: reduce)').matches
          ? 'instant'
          : 'smooth',
        block: 'start',
      });
    }
    track('quote_step_view', { step: step + 1 });
  }
  function valid(report = true) {
    input('name').setCustomValidity(
      input('name').value && !input('name').value.trim()
        ? 'Please enter your name.'
        : '',
    );
    input('items').setCustomValidity(
      input('items').value && input('items').value.trim().length < 3
        ? 'Please describe what needs to go.'
        : '',
    );
    phone.setCustomValidity('');
    email.setCustomValidity('');
    if (step === 1) {
      const checked = form!.querySelectorAll('[name=categories]:checked');
      document.querySelector('#category-error')!.textContent = checked.length
        ? ''
        : 'Choose at least one type of item.';
      if (!checked.length) {
        if (report)
          form!.querySelector<HTMLInputElement>('[name=categories]')!.focus();
        return false;
      }
    }
    if (step === 3) {
      if (!phone.value.trim() && !email.value.trim())
        phone.setCustomValidity(
          'Add a phone number or email so we can respond.',
        );
      else if (
        phone.value.trim() &&
        !/^\+?[\d\s().-]+$/.test(phone.value.trim())
      )
        phone.setCustomValidity('Enter a valid phone number.');
      else if (phone.value.trim() && phone.value.replace(/\D/g, '').length < 10)
        phone.setCustomValidity('Enter at least 10 digits.');
      const preference = input('contactPreference').value;
      if (preference === 'email' && !email.value.trim())
        email.setCustomValidity(
          'Add an email for your preferred contact method.',
        );
      if (preference === 'phone' && !phone.value.trim())
        phone.setCustomValidity(
          'Add a phone number for your preferred contact method.',
        );
    }
    photos.setCustomValidity(validatePhotos(Array.from(photos.files || [])));
    const controls = Array.from(
      panels[step].querySelectorAll<
        HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
      >('input,select,textarea'),
    );
    for (const control of controls) {
      if (!control.checkValidity()) {
        if (report) {
          control.setAttribute('aria-invalid', 'true');
          document.querySelector('#step-error')!.textContent =
            control.validationMessage;
          control.reportValidity();
        }
        return false;
      }
    }
    return true;
  }
  function renderPhotos() {
    photoUrls.forEach(URL.revokeObjectURL);
    photoUrls = [];
    const preview = document.querySelector('#photo-preview')!;
    preview.replaceChildren();
    const files = Array.from(photos.files || []);
    photos.setCustomValidity(validatePhotos(files));
    document.querySelector('#photo-error')!.textContent =
      photos.validationMessage;
    (document.querySelector('#clear-photos') as HTMLButtonElement).hidden =
      !files.length;
    if (!photos.checkValidity()) {
      photos.reportValidity();
      return;
    }
    files.forEach((file, index) => {
      const url = URL.createObjectURL(file);
      photoUrls.push(url);
      const tile = document.createElement('div');
      const img = document.createElement('img');
      img.src = url;
      img.alt = `Selected project photo ${index + 1}`;
      const remove = document.createElement('button');
      remove.type = 'button';
      remove.textContent = '×';
      remove.setAttribute('aria-label', `Remove photo ${index + 1}`);
      remove.addEventListener('click', () => {
        const transfer = new DataTransfer();
        files
          .filter((_, i) => i !== index)
          .forEach((f) => transfer.items.add(f));
        photos.files = transfer.files;
        renderPhotos();
      });
      tile.append(img, remove);
      preview.append(tile);
    });
  }
  document.querySelector('#clear-photos')!.addEventListener('click', () => {
    photos.value = '';
    renderPhotos();
    photos.focus();
  });
  window.addEventListener('pageshow', (event) => {
    if (event.persisted) renderPhotos();
  });
  photos.addEventListener('change', () => {
    renderPhotos();
    if (photos.files?.length && !photos.validationMessage)
      track('photo_upload', { count: photos.files.length });
  });
  window.addEventListener('pagehide', () =>
    photoUrls.forEach(URL.revokeObjectURL),
  );
  form.addEventListener('input', (event) => {
    const target = event.target;
    if (
      target instanceof HTMLInputElement ||
      target instanceof HTMLTextAreaElement ||
      target instanceof HTMLSelectElement
    ) {
      target.setCustomValidity('');
      target.removeAttribute('aria-invalid');
    }
    document.querySelector('#step-error')!.textContent = '';
    if (form!.querySelector('[name=categories]:checked'))
      document.querySelector('#category-error')!.textContent = '';
    phone.setCustomValidity('');
    email.setCustomValidity('');
    if (!started) {
      track('quote_form_start');
      started = true;
    }
  });
  back.addEventListener('click', () => {
    if (!pending) show(Math.max(0, step - 1));
  });
  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    if (pending) return;
    if (!valid()) return;
    if (step < 4) {
      show(step + 1);
      return;
    }
    // Validate every panel again before delivery, including values edited via dev tools.
    for (let i = 0; i < 4; i++) {
      step = i;
      if (!valid(false)) {
        show(i);
        valid();
        return;
      }
    }
    step = 4;
    pending = true;
    next.disabled = true;
    back.disabled = true;
    form.setAttribute('aria-busy', 'true');
    next.textContent = 'Sending…';
    status.textContent = '';
    const data = values();
    data.set('requestId', requestId);
    data.set(
      'intake',
      JSON.stringify({
        schemaVersion: '1.0',
        source: 'website',
        stage: 'new_inquiry',
        project: {
          categories: data.getAll('categories'),
          volume: data.get('volume'),
          timeframe: data.get('timeframe'),
          access: data.get('access'),
          propertyType: data.get('propertyType'),
          description: data.get('items'),
          photoCount: photos.files?.length || 0,
        },
        contactPreference: data.get('contactPreference'),
        coverageStatus: 'needs_confirmation',
      }),
    );
    try {
      await submitLead(data, form.dataset.endpoint || '');
      track('quote_form_submit', { mode: String(data.get('mode')) });
      form.hidden = true;
      document.querySelector('.quote-progress')!.setAttribute('hidden', '');
      const success = document.querySelector<HTMLElement>('#quote-success')!;
      success.hidden = false;
      success.focus();
      form.reset();
      photoUrls.forEach(URL.revokeObjectURL);
    } catch (error) {
      status.className = 'form-status error';
      status.textContent =
        error instanceof Error &&
        !['TimeoutError', 'TypeError', 'AbortError'].includes(error.name)
          ? error.message
          : 'We couldn’t confirm delivery. Your answers are still here. Please try again.';
      status.focus();
    } finally {
      pending = false;
      next.disabled = !form.dataset.endpoint;
      back.disabled = false;
      next.textContent = 'Send My Request →';
      form.removeAttribute('aria-busy');
    }
  });
  show(initialZip && /^\d{5}$/.test(initialZip) ? 1 : 0, false);
}
