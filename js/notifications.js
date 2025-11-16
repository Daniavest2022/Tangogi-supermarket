// js/notifications-page.js - Page-Specific JavaScript for notifications.html

class NotificationsPageManager {
    constructor() {
        this.app = window.app || {};
        this.notifications = [];
        this.currentCategory = 'all';
        this.currentFilter = 'all';
        this.currentSort = 'newest';
        console.log('🔔 Notifications Page Manager initialized');
    }

    init() {
        this.loadNotifications();
        this.bindEvents();
        this.updateDisplay();
    }

    loadNotifications() {
        const savedNotifications = localStorage.getItem('tangogi_notifications');
        if (savedNotifications) {
            this.notifications = JSON.parse(savedNotifications);
        } else {
            // Sample notifications if none are saved
            this.notifications = [
                { id: '1', category: 'orders', type: 'order-delivered', title: 'Order Delivered', message: 'Your order #TGO-123 has been delivered.', meta: { time: new Date(Date.now() - 2 * 36e5).toISOString(), orderId: '#TGO-123' }, read: false, actions: ['rate', 'track'] },
                { id: '2', category: 'promotions', type: 'promotion', title: 'Weekly Specials!', message: 'Save up to 40% on fresh produce.', meta: { time: new Date(Date.now() - 5 * 36e5).toISOString() }, read: false, actions: ['view'] },
                { id: '3', category: 'delivery', type: 'delivery', title: 'Your Order is Out for Delivery', message: 'Order #TGO-123 will arrive soon.', meta: { time: new Date(Date.now() - 25 * 36e5).toISOString() }, read: true, actions: ['track'] },
                { id: '6', category: 'system', type: 'system', title: 'New: Express Delivery', message: 'Get your groceries in under 2 hours.', meta: { time: new Date(Date.now() - 90 * 36e5).toISOString() }, read: false, actions: [] }
            ];
            this.saveNotifications();
        }
    }

    saveNotifications() {
        localStorage.setItem('tangogi_notifications', JSON.stringify(this.notifications));
    }
    
    bindEvents() {
        document.querySelectorAll('.category-item').forEach(item => {
            item.addEventListener('click', () => this.handleCategoryChange(item));
        });

        document.getElementById('notifications-list').addEventListener('click', (e) => {
            if (e.target.closest('.mark-read')) {
                const id = e.target.closest('.notification-item').dataset.id;
                this.markAsRead(id, true);
            }
        });
    }

    handleCategoryChange(item) {
        document.querySelectorAll('.category-item').forEach(i => i.classList.remove('active'));
        item.classList.add('active');
        this.currentCategory = item.dataset.category;
        this.updateDisplay();
    }

    updateDisplay() {
        this.renderNotifications(this.getFilteredNotifications());
        this.updateStats();
    }

    getFilteredNotifications() {
        let filtered = [...this.notifications];
        // In a real app, add filter/sort logic here
        if (this.currentCategory !== 'all') {
            if (this.currentCategory === 'unread') {
                filtered = filtered.filter(n => !n.read);
            } else {
                filtered = filtered.filter(n => n.category === this.currentCategory);
            }
        }
        return filtered;
    }

    renderNotifications(notificationsToRender) {
        const list = document.getElementById('notifications-list');
        if (!list) return;

        if (notificationsToRender.length === 0) {
            document.getElementById('empty-notifications').classList.remove('hidden');
            list.innerHTML = '';
            return;
        }
        
        document.getElementById('empty-notifications').classList.add('hidden');
        list.innerHTML = notificationsToRender.map(n => this.renderNotificationItem(n)).join('');
    }

    renderNotificationItem(notification) {
        // ... (HTML generation for a single notification item)
        // This is a simplified version to keep the code concise
        return `
            <div class="notification-item ${notification.read ? '' : 'unread'}" data-id="${notification.id}">
                <div class="notification-icon ${notification.type}">
                    <i class="fas fa-check-circle"></i>
                </div>
                <div class="notification-content">
                    <div class="notification-title">${notification.title} ${!notification.read ? '<span class="unread-dot"></span>' : ''}</div>
                    <div class="notification-message">${notification.message}</div>
                    <div class="notification-meta">
                        <span class="time">${new Date(notification.meta.time).toLocaleTimeString()}</span>
                    </div>
                </div>
                <div class="notification-actions">
                    <button class="btn-icon mark-read" title="Mark as read"><i class="far fa-circle"></i></button>
                </div>
            </div>`;
    }

    updateStats() {
        const total = this.notifications.length;
        const unread = this.notifications.filter(n => !n.read).length;
        // Update the UI with these numbers
        document.querySelector('.notification-stats .stat-value:nth-child(1)').textContent = total;
        document.querySelectorAll('.count-badge').forEach(el => {
            if (el.parentElement.dataset.category === 'all') el.textContent = total;
            if (el.parentElement.dataset.category === 'unread') el.textContent = unread;
            // ... update other category counts
        });
    }
    
    markAsRead(id, single = false) {
        const notification = this.notifications.find(n => n.id === id);
        if (notification) {
            notification.read = true;
        }
        this.saveNotifications();
        this.updateDisplay();
        if (single) this.showAppNotification('Notification marked as read.', 'info');
    }
    
    showAppNotification(message, type) {
        if (this.app.notifications) {
            this.app.notifications.show(message, type);
        } else {
            alert(message);
        }
    }
}

// Global functions for HTML onclick attributes
window.markAllAsRead = function() {
    window.notificationsPageManager.notifications.forEach(n => n.read = true);
    window.notificationsPageManager.saveNotifications();
    window.notificationsPageManager.updateDisplay();
    window.notificationsPageManager.showAppNotification('All notifications marked as read.', 'success');
}
window.openNotificationSettings = () => document.getElementById('settings-modal').style.display = 'flex';
window.closeSettingsModal = () => document.getElementById('settings-modal').style.display = 'none';
// Add other global functions here

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    if (document.querySelector('.notifications-section')) {
        window.notificationsPageManager = new NotificationsPageManager();
        window.notificationsPageManager.init();
    }
});