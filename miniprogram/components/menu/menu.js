Component({
  properties: {
    buttonText: {
      type: String,
      value: ''
    },
    menuItems: {
      type: Array,
      value: []
    }
  },

  data: {
    showMenu: false
  },

  methods: {
    toggleMenu() {
      this.setData({
        showMenu: !this.data.showMenu
      });
    },

    onSelect(e) {
      const index = e.currentTarget.dataset.index;
      const selectedItem = this.data.menuItems[index];
      this.triggerEvent('select', selectedItem);
      this.setData({
        showMenu: false
      });
    }
  }
});