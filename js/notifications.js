// js/notifications.js
export class NotificationManager {
    show(message, type = 'info') {
        // Remove any existing notifications
        document.querySelectorAll('.tangogi-notification').forEach(el => el.remove());

        const notification = document.createElement('div');
        notification.className = `tangogi-notification notification-${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <i class="fas fa-${this.getIcon(type)}"></i>
                <span>${message}</span>
            </div>
        `;
        document.body.appendChild(notification);

        setTimeout(() => {
            notification.style.animation = 'slideOutRight 0.3s ease-in';
            setTimeout(() => notification.remove(), 300);
        }, 5000);

        notification.addEventListener('click', () => {
            notification.style.animation = 'slideOutRight 0.3s ease-in';
            setTimeout(() => notification.remove(), 300);
        });
    }

    getIcon(type) {
        const icons = { success: 'check-circle', error: 'exclamation-circle', warning: 'exclamation-triangle', info: 'info-circle' };
        return icons[type] || 'info-circle';
    }
}