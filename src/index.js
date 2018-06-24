import React from 'react';
import ReactDOM from 'react-dom';
import '../css/servicebot--colors.css';
import '../css/servicebot--form-elements.css';
import '../css/servicebot--layout.css';
import '../css/servicebot--text-elements.css';
import '../css/main.css';
import ServicebotBillingSettingsEmbed from './ServicebotBillingSettings';
import { AppContainer } from 'react-hot-loader'

// ReactDOM.render(<App />, document.getElementById('root'));

const BillingSettings = (config) => {
    ReactDOM.render(<ServicebotBillingSettingsEmbed {...config} external={true} />, config.selector);
}


export {ServicebotBillingSettingsEmbed, BillingSettings}

if (module.hot) {
    module.hot.accept('./ServicebotBillingSettings.js', () => {
        const NextApp = require('./ServicebotBillingSettings.js').default;
        ReactDOM.render(
            <AppContainer>
                <NextApp/>
            </AppContainer>,
            document.getElementById('root')
        );
    });
}
