// js/addresses.js - Page-Specific JavaScript for addresses.html

// --- Global Functions to be called from HTML ---

// These functions need to be global so the `onclick` attributes in the HTML can find them.
function openAddressForm(addressId = null) {
    if (window.addressManager) {
        window.addressManager.openAddressForm(addressId);
    }
}

function closeAddressModal() {
    if (window.addressManager) {
        window.addressManager.closeAddressModal();
    }
}

function closeDeleteModal() {
    if (window.addressManager) {
        window.addressManager.closeDeleteModal();
    }
}


class AddressManager {
    constructor() {
        // Sample data - in a real app, this would come from a server or localStorage
        this.addresses = [
            { id: 1, type: 'home', name: 'Adeeke Daniel', phone: '+234 812 345 6789', line1: '123 Main Street, Apartment 4B', city: 'Ikeja GRA', state: 'Lagos', postalCode: '100001', isDefault: true },
            { id: 2, type: 'work', name: 'Adeeke Daniel', phone: '+234 809 876 5432', line1: 'Tangogi Supermarket HQ', city: 'Victoria Island', state: 'Lagos', postalCode: '101241', isDefault: false },
            { id: 3, type: 'family', name: 'Mrs. Adeeke', phone: '+234 807 654 3210', line1: '789 Family Estate', city: 'Lekki Phase 1', state: 'Lagos', postalCode: '105102', isDefault: false, instructions: 'Gate code: 1234' }
        ];
        this.addressToDelete = null;

        console.log('🏠 Address Manager Initialized');
    }

    init() {
        this.cacheDOMElements();
        this.bindEvents();
        this.renderAddresses(); // Initial render of the address list
    }

    cacheDOMElements() {
        this.elements = {
            addressList: document.getElementById('addresses-list'),
            addressModal: document.getElementById('address-modal'),
            modalTitle: document.getElementById('modal-title'),
            addressForm: document.getElementById('address-form'),
            deleteModal: document.getElementById('delete-modal'),
            confirmDeleteBtn: document.getElementById('confirm-delete'),
        };
    }

    bindEvents() {
        // Event delegation for Edit, Delete, and Set as Default buttons
        this.elements.addressList.addEventListener('click', (event) => {
            const target = event.target.closest('button');
            if (!target) return;

            const addressId = target.dataset.addressId;

            if (target.classList.contains('edit-address')) {
                this.openAddressForm(Number(addressId));
            } else if (target.classList.contains('delete-address')) {
                this.openDeleteModal(Number(addressId));
            } else if (target.classList.contains('set-default')) {
                this.setDefaultAddress(Number(addressId));
            }
        });

        // Handle form submission
        this.elements.addressForm.addEventListener('submit', (event) => {
            event.preventDefault();
            this.handleFormSubmit();
        });
        
        // Handle confirm delete
        this.elements.confirmDeleteBtn.addEventListener('click', () => {
            this.deleteAddress();
        });
    }

    renderAddresses() {
        // Clear existing list (except for the "Add New" card)
        this.elements.addressList.innerHTML = '';
        
        // Sort addresses to show the default one first
        this.addresses.sort((a, b) => b.isDefault - a.isDefault);
        
        // Create HTML for each address
        this.addresses.forEach(address => {
            this.elements.addressList.innerHTML += this.createAddressCardHTML(address);
        });

        // Append the "Add New" card at the end
        this.elements.addressList.innerHTML += `
            <div class="address-card add-new-card" onclick="openAddressForm()">
                <div class="add-new-content">
                    <i class="fas fa-plus-circle"></i>
                    <h3>Add New Address</h3>
                    <p>Save a new delivery address</p>
                    <button class="btn btn-primary">Add Address</button>
                </div>
            </div>
        `;
    }

    createAddressCardHTML(address) {
        const typeIcons = { home: 'fa-home', work: 'fa-building', family: 'fa-heart', other: 'fa-map-marker-alt' };
        
        return `
            <div class="address-card ${address.isDefault ? 'default-address' : ''}" data-address-id="${address.id}">
                <div class="address-header">
                    <div class="address-type">
                        <i class="fas ${typeIcons[address.type] || 'fa-map-marker-alt'}"></i>
                        <span>${address.type.charAt(0).toUpperCase() + address.type.slice(1)}</span>
                        ${address.isDefault ? '<div class="default-badge"><i class="fas fa-star"></i> Default</div>' : ''}
                    </div>
                    <div class="address-actions">
                        <button class="btn-icon edit-address" data-address-id="${address.id}"><i class="fas fa-edit"></i></button>
                        <button class="btn-icon delete-address" data-address-id="${address.id}"><i class="fas fa-trash"></i></button>
                    </div>
                </div>
                <div class="address-details">
                    <h3 class="address-name">${address.name}</h3>
                    <p class="address-text">
                        ${address.line1}<br>
                        ${address.city}<br>
                        ${address.state}, ${address.postalCode || ''}<br>
                        Nigeria
                    </p>
                    <div class="contact-info">
                        <span class="phone"><i class="fas fa-phone"></i> ${address.phone}</span>
                    </div>
                    ${address.instructions ? `<div class="address-notes"><i class="fas fa-info-circle"></i> ${address.instructions}</div>` : ''}
                </div>
                <div class="address-footer">
                    <button class="btn ${address.isDefault ? 'btn-outline' : 'btn-primary'} btn-sm set-default" data-address-id="${address.id}" ${address.isDefault ? 'disabled' : ''}>
                        ${address.isDefault ? 'Default Address' : 'Set as Default'}
                    </button>
                </div>
            </div>
        `;
    }

    openAddressForm(addressId = null) {
        this.elements.addressForm.reset();
        
        if (addressId) {
            // Editing existing address
            const address = this.addresses.find(addr => addr.id === addressId);
            if (!address) return;

            this.elements.modalTitle.textContent = 'Edit Address';
            document.getElementById('address-id').value = address.id;
            document.querySelector(`input[name="addressType"][value="${address.type}"]`).checked = true;
            document.getElementById('fullName').value = address.name;
            document.getElementById('phoneNumber').value = address.phone;
            document.getElementById('addressLine1').value = address.line1;
            document.getElementById('city').value = address.city;
            document.getElementById('state').value = address.state;
            document.getElementById('postalCode').value = address.postalCode || '';
            document.getElementById('setAsDefault').checked = address.isDefault;
            
        } else {
            // Adding new address
            this.elements.modalTitle.textContent = 'Add New Address';
            document.getElementById('address-id').value = '';
        }

        this.elements.addressModal.style.display = 'flex';
    }
    
    closeAddressModal() {
        this.elements.addressModal.style.display = 'none';
    }

    handleFormSubmit() {
        const formData = new FormData(this.elements.addressForm);
        const addressId = formData.get('addressId');

        const addressData = {
            type: formData.get('addressType'),
            name: formData.get('fullName'),
            phone: formData.get('phoneNumber'),
            line1: formData.get('addressLine1'),
            city: formData.get('city'),
            state: formData.get('state'),
            postalCode: formData.get('postalCode'),
            isDefault: formData.get('setAsDefault') === 'on'
        };

        if (addressId) {
            // Update existing address
            const index = this.addresses.findIndex(addr => addr.id == addressId);
            this.addresses[index] = { ...this.addresses[index], ...addressData };
        } else {
            // Add new address
            addressData.id = Date.now(); // Simple unique ID
            this.addresses.push(addressData);
        }

        if (addressData.isDefault) {
            this.setDefaultAddress(addressData.id, true);
        }

        this.renderAddresses();
        this.closeAddressModal();
    }
    
    openDeleteModal(addressId) {
        this.addressToDelete = addressId;
        this.elements.deleteModal.style.display = 'flex';
    }
    
    closeDeleteModal() {
        this.addressToDelete = null;
        this.elements.deleteModal.style.display = 'none';
    }
    
    deleteAddress() {
        if (this.addressToDelete) {
            this.addresses = this.addresses.filter(addr => addr.id !== this.addressToDelete);
            this.renderAddresses();
        }
        this.closeDeleteModal();
    }
    
    setDefaultAddress(addressId, fromSubmit = false) {
        // Unset any other default address
        this.addresses.forEach(addr => addr.isDefault = false);
        
        // Set the new default
        const newDefault = this.addresses.find(addr => addr.id === addressId);
        if (newDefault) {
            newDefault.isDefault = true;
        }

        if (!fromSubmit) {
            this.renderAddresses();
        }
    }
}

// Initialize the manager when the page is loaded
document.addEventListener('DOMContentLoaded', () => {
    // We only want this script to run on the addresses page
    if (document.querySelector('.addresses-section')) {
        window.addressManager = new AddressManager();
        window.addressManager.init();
    }
});