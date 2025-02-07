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
                                    name: 'Position',
                                    children: [
                                        mappingFormItem('Flex', {
                                            attr: { col: 2 }, name: 'Position', children: [
                                                mappingFormItem('Number', { attr: {
                                                        controlsPosition: 'right'
                                                    }, name: 'x', mappingKey: 'centerX', defaultValue: 0 }),
                                                mappingFormItem('Number', { attr: {
                                                        controlsPosition: 'right'
                                                    }, name: 'y', mappingKey: 'centerY', defaultValue: 0 })
                                            ] }),
                                        mappingFormItem('Slider', {
                                            attr: {
                                                min: 1,
                                                max: 200,
                                                step: 1
                                            }, name: 'Scale', mappingKey: 'scale', defaultValue: 100, label: '%'
                                        })
                                    ]
                                })
                            ]
                        }),
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
