import { mappingFormItem } from '@/utils/formItemUtils';
// Element property configuration
export const Options = {
    attributes: [
        mappingFormItem('Tabs', {
            children: [
                mappingFormItem('TabPane', {
                    name: 'Properties',
                    children: [
                        mappingFormItem('Collapse', {
                            children: [
                                mappingFormItem('CollapsePane', {
                                    name: 'Basic',
                                    children: [
                                        mappingFormItem('Boolean', { name: 'Mute', mappingKey: 'silent', defaultValue: false })
                                    ]
                                })
                            ]
                        })
                    ]
                }),
                mappingFormItem('TabPane', {
                    name: 'Animation',
                    children: []
                })
            ]
        })
    ]
};
