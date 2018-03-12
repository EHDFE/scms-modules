export const preventBlur = (elem, func) => {
  let fnDocumentMousedown;
  const $document = $(document);
  $(elem).on('focus', () => {
    $document.on(
      'mousedown',
      (fnDocumentMousedown = function (event) {
        if (func(event.target)) {
          event.target.setAttribute('unselectable', 'on');
          event.preventDefault();
        } else if (event.target != elem) {
          $document.off('mousedown', fnDocumentMousedown);
        }
      }),
    );
  });
  $(elem).on('blur', () => {
    $document.off('mousedown', fnDocumentMousedown);
  });
}