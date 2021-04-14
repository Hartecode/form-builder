// Code in the client-side JavaScript file for the trigger editor

(() => {
    subscribe('sfcc:ready', (props) => {

        const template = `<div>
            <p>Open car picker editor</p>
            <button  id='breakout-trigger'>${'build'}</button>
            </div>`;
        console.log(props)
        document.body.innerHTML += template;
        const openButtonEl = document.querySelector('#breakout-trigger');
        openButtonEl.addEventListener('click', handleBreakoutOpen);
    });

    function handleBreakoutOpen() {
        emit({
            type: 'sfcc:breakout',
            payload: {
                id: 'formBuilderBreakout',
                title: 'The title to be displayed in the modal'
            }
        }, handleBreakoutClose);
    }

    function handleBreakoutClose({ type, value }) {
        // Now the "value" can be passed back to Page Designer
        if (type === 'sfcc:breakoutApply') {
            handleBreakoutApply(value);
        } else {
            handleBreakoutCancel();
        }
    }

    function handleBreakoutCancel() {
        // left empty in case you want to do more customization on this event
    }

    function handleBreakoutApply(value) {
        // Emit value update to Page Designer host application
        emit({
            type: 'sfcc:value',
            payload: value
        });
    }
})();