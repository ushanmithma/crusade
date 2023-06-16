require('bootstrap')
import 'simplebar'
import ResizeObserver from 'resize-observer-polyfill'
window.ResizeObserver = ResizeObserver

const sidebar = document.querySelector('[data-sidebar]')
const menuIcon = document.querySelector('[data-menu-icon-btn]')

const sidebarStatus = localStorage.getItem('sidebar-status')

function setSidebarStatus(status) {
	localStorage.setItem('sidebar-status', status)
}

function toggleSidebar() {
	if (sidebar.classList.contains('open')) {
		sidebar.classList.remove('open')
		setSidebarStatus('close')
	} else {
		sidebar.classList.add('open')
		setSidebarStatus('open')
	}
}

function checkSidebarStatus() {
	if (sidebarStatus == 'open') {
		sidebar.classList.add('open')
	} else if (sidebarStatus == 'close') {
		sidebar.classList.add('open')
	}
}

menuIcon.addEventListener('click', (event) => {
	event.preventDefault()
	toggleSidebar()
})

checkSidebarStatus()
