/* =====================================================
   水まわりサポート あおぞら（架空）- 広告用LP サンプル
   ===================================================== */
(() => {
  'use strict';

  /* ----- 受付状況（現在時刻を表示） ----- */
  const nowEls = document.querySelectorAll('.js-now');
  const updateNow = () => {
    const d = new Date();
    const hh = String(d.getHours()).padStart(2, '0');
    const mm = String(d.getMinutes()).padStart(2, '0');
    nowEls.forEach((el) => {
      el.textContent = `｜現在 ${hh}:${mm} 受付中`;
    });
  };
  if (nowEls.length) {
    updateNow();
    setInterval(updateNow, 30000);
  }

  /* ----- ヘッダーの影 ----- */
  const header = document.querySelector('.header');
  const onScrollHeader = () => {
    header.classList.toggle('is-scrolled', window.scrollY > 10);
  };

  /* ----- SP固定CTA：FVを過ぎたら表示、フォーム表示中は隠す ----- */
  const fixedCta = document.getElementById('fixedCta');
  const fv = document.querySelector('.fv');
  const contact = document.getElementById('contact');
  if (fixedCta && fv && contact && 'IntersectionObserver' in window) {
    let fvVisible = true;
    let contactVisible = false;
    const render = () => {
      fixedCta.classList.toggle('is-show', !fvVisible && !contactVisible);
    };
    new IntersectionObserver(([entry]) => {
      fvVisible = entry.isIntersecting;
      render();
    }, { rootMargin: '0px 0px -40% 0px' }).observe(fv);
    new IntersectionObserver(([entry]) => {
      contactVisible = entry.isIntersecting;
      render();
    }).observe(contact);
  }

  if (header) {
    onScrollHeader();
    window.addEventListener('scroll', onScrollHeader, { passive: true });
  }

  /* ----- フェードイン ----- */
  const fadeEls = document.querySelectorAll('.js-fade');
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { rootMargin: '0px 0px -10% 0px' });
    fadeEls.forEach((el) => io.observe(el));
  } else {
    fadeEls.forEach((el) => el.classList.add('is-visible'));
  }

  /* ----- FAQ アコーディオン ----- */
  document.querySelectorAll('.faq__q').forEach((btn) => {
    btn.addEventListener('click', () => {
      const panel = document.getElementById(btn.getAttribute('aria-controls'));
      const isOpen = btn.getAttribute('aria-expanded') === 'true';
      btn.setAttribute('aria-expanded', String(!isOpen));
      panel.hidden = isOpen;
    });
  });

  /* ----- フォームのバリデーション（サンプルのため送信はしない） ----- */
  const form = document.getElementById('contactForm');
  if (!form) return;

  const rules = {
    'f-trouble': (v) => (v ? '' : 'お困りごとを選択してください'),
    'f-name': (v) => (v.trim() ? '' : 'お名前を入力してください'),
    'f-tel': (v) => {
      const digits = v.replace(/[^\d０-９]/g, '');
      if (!v.trim()) return '電話番号を入力してください';
      if (digits.length < 10 || digits.length > 11) return '電話番号は10〜11桁で入力してください';
      return '';
    },
    'f-area': (v) => (v.trim() ? '' : 'ご住所（市町村まで）を入力してください'),
  };

  const validateField = (id) => {
    const input = document.getElementById(id);
    const errorEl = form.querySelector(`[data-error-for="${id}"]`);
    const message = rules[id](input.value);
    errorEl.textContent = message;
    input.classList.toggle('is-error', Boolean(message));
    input.setAttribute('aria-invalid', message ? 'true' : 'false');
    if (message) {
      input.setAttribute('aria-describedby', errorEl.id || (errorEl.id = `${id}-error`));
    } else {
      input.removeAttribute('aria-describedby');
    }
    return !message;
  };

  Object.keys(rules).forEach((id) => {
    const input = document.getElementById(id);
    input.addEventListener('blur', () => validateField(id));
    input.addEventListener('input', () => {
      if (input.classList.contains('is-error')) validateField(id);
    });
  });

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const results = Object.keys(rules).map(validateField);
    if (results.includes(false)) {
      const firstError = form.querySelector('.is-error');
      if (firstError) firstError.focus();
      return;
    }
    const done = document.getElementById('formDone');
    form.querySelector('.form__submit').disabled = true;
    done.hidden = false;
    done.focus();
  });
})();
