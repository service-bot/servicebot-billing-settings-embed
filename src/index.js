import React from 'react';
import ReactDOM from 'react-dom';
import ServicebotBillingSettingsEmbed from './ServicebotBillingSettings';
import { AppContainer } from 'react-hot-loader'

// ReactDOM.render(<App />, document.getElementById('root'));

const BillingSettings = (config) => {
    if(config.useAsComponent){
        return <ServicebotBillingSettingsEmbed
            {...config}
        />
    }
    ReactDOM.render(<ServicebotBillingSettingsEmbed {...config} external={true} />, config.selector);
}



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

export default BillingSettings
