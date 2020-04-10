$(function() {
  const createSection = $('.create');
  const addBtns = $('.btn-add');
  const form = $('.create__form');
  const submitBtn = $('.btn-submit');
  const cancelBtn = $('.btn-cancel');

  addBtns.on('click', function(e) {
    createSection.slideDown();
  });

  form.on('submit', function(e) {
    const formData = $(this).serializeArray();
    e.preventDefault();
    console.log(formData);
  });

  cancelBtn.on('click', function(e) {
    e.preventDefault();
    createSection.slideUp();
  });
});
