$(function() {
  const app = {
    $contactsSection: $('.contacts'),
    $contactsUl: $('.grid-container-contacts'),
    $createSection: $('.create'),
    $addBtns: $('.btn-add'),
    $form: $('.create__form'),
    $cancelBtn: $('.btn-cancel'),
    $searchInput: $('#search-input'),
    name: document.getElementById('name'),
    email: document.getElementById('email'),
    phone: document.getElementById('phone'),
    contacts: [],
    editing: false,
    editingId: 0,

    handleShowForm: function(e) {
      e && e.preventDefault();
      this.$contactsSection.slideUp();
      this.$createSection.slideDown();
    },

    handleHideForm: function(e) {
      e && e.preventDefault();
      this.$createSection.slideUp();
      this.$contactsSection.slideDown();
    },

    handleSubmit: function(e) {
      const self = this;
      const newContact = {
        full_name: this.name.value,
        email: this.email.value,
        phone_number: this.phone.value
      };

      e.preventDefault();

      if (this.editing) {
        $.ajax({
          type: 'PUT',
          url: `/api/contacts/${this.editingId}`,
          data: newContact
        }).done(contact => {
          self.renderContacts();
          self.handleHideForm();
          self.editing = false;
        });
      } else {
        $.ajax({
          url: '/api/contacts/',
          type: 'POST',
          data: newContact
        }).done(contact => {
          self.renderContacts();
          self.handleHideForm();
        });
      }
    },

    populateInputs: function(contact) {
      this.name.value = contact.full_name;
      this.email.value = contact.email;
      this.phone.value = contact.phone_number;
    },

    handleEdit: function(e) {
      const self = this;

      this.handleShowForm();
      this.editing = true;
      this.editingId = parseInt(
        $(e.target)
          .parent()
          .parent()
          .attr('data-id'),
        10
      );
      $.ajax({
        type: 'GET',
        url: `/api/contacts/${this.editingId}`
      }).done(contact => {
        self.populateInputs(contact);
      });
    },

    handleDelete: function(e) {
      const $item = $(e.target)
        .parent()
        .parent();
      const itemId = parseInt($item.attr('data-id'), 10);

      $.ajax({
        type: 'DELETE',
        url: `/api/contacts/${itemId}`
      });
      this.renderContacts();
    },

    clearContacts: function() {
      this.$contactsUl.empty();
    },

    handleSearch: function(e) {
      this.renderContacts();
    },

    renderContacts: function() {
      const self = this;
      const template = $('#template-contact').html();
      const templateScript = Handlebars.compile(template);

      $.ajax({
        type: 'GET',
        url: '/api/contacts',
        dataType: 'json'
      }).done(function(response) {
        if (response.length > 0) {
          $('.grid-container-contacts').show();
          $('.contacts__no-contacts').hide();
        }

        self.clearContacts();

        response
          .filter(contact => {
            if (self.$searchInput.val().length > 0) {
              return contact.full_name
                .toLowerCase()
                .includes(self.$searchInput.val().toLowerCase());
            } else {
              return true;
            }
          })
          .forEach(({ full_name, email, phone_number, id }) => {
            const context = { name: full_name, email, phone: phone_number, id };
            const html = templateScript(context);

            self.$contactsUl.append(html);
          });
      });
    },

    init: function() {
      this.$addBtns.on('click', this.handleShowForm.bind(this));
      this.$cancelBtn.on('click', this.handleHideForm.bind(this));
      this.$form.on('submit', this.handleSubmit.bind(this));
      this.$contactsUl.on(
        'click',
        '.contacts__btn-delete',
        this.handleDelete.bind(this)
      );
      this.$contactsUl.on(
        'click',
        '.contacts__btn-edit',
        this.handleEdit.bind(this)
      );
      this.$searchInput.on('input', this.handleSearch.bind(this));
      this.renderContacts();
    }
  };
  app.init();
});
