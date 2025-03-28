import { mappingFormItem } from '@/utils/formItemUtils';
// Element attribute configuration
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
                                        mappingFormItem('Flex', { attr: { col: 2 }, name: 'Position', children: [
                                                mappingFormItem('Number', { attr: {
                                                        controlsPosition: 'right'
                                                    }, name: 'x', mappingKey: 'left', defaultValue: 0 }),
                                                mappingFormItem('Number', { attr: {
                                                        controlsPosition: 'right'
                                                    }, name: 'y', mappingKey: 'top', defaultValue: 0 })
                                            ] }),
                                        mappingFormItem('Slider', { attr: {
                                                min: 1,
                                                max: 200,
                                                step: 1
                                            }, name: 'Scale', mappingKey: 'scale', defaultValue: 100, label: '%' })
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
