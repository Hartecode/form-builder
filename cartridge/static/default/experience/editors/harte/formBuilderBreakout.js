(() => {
    subscribe('sfcc:ready', ({value = {}}) => {
        // Once the breakout editor is ready, the custom code is able to select or
        // Create a value. Any meaningful change to a value/selection needs to be
        // reflected back into the host container via a `sfcc:value` event.
        const template = document.createElement('template');
        template.innerHTML = `
            <div class="container">
            <iframe
            id="target"
            name="builder" src="build/index.html"
            frameborder="0" height="100%" width="100%"></iframe></div>`;
        const clone = document.importNode(template.content, true);
        document.body.appendChild(clone);
        const iframe = document.querySelector('#target');
        iframe.onload = () => {
            iframe.contentWindow.postMessage(value, "*");
        }
        window.addEventListener("message", (event) => {
            if ('formData' in event.data) {
                emit({
                    type: 'sfcc:value',
                    payload: event.data
                });
            }
        }, false);

    });
})();