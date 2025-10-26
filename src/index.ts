import { mount } from 'ripple';
import { App } from './App.ripple';
import { setupRouter } from './router';

mount(App, {
	target: document.getElementById('root'),
});

// Initialize the hash-based router after the App mounts
setTimeout(() => {
	setupRouter();
}, 0);
