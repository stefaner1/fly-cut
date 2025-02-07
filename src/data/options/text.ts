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
                                        mappingFormItem('Flex', { attr: { col: 2 }, name: 'Position', children: [
                                                mappingFormItem('Number', { attr: {
                                                        controlsPosition: 'right'
                                                    }, name: 'x', mappingKey: 'centerX', defaultValue: 0 }),
                                                mappingFormItem('Number', { attr: {
                                                        controlsPosition: 'right'
                                                    }, name: 'y', mappingKey: 'centerY', defaultValue: 0 })
                                            ] }),
                                        mappingFormItem('Slider', { attr: {
                                                min: 1,
                                                max: 200,
                                                step: 1
                                            }, name: 'Scale', mappingKey: 'scale', defaultValue: 100, label: '%' })
                                    ]
                                })
                            ]
                        }),
                        mappingFormItem('Collapse', {
                            children: [
                                mappingFormItem('CollapsePane', {
                                    name: 'Text',
                                    children: [
                                        mappingFormItem('Number', { attr: {
                                                controlsPosition: 'right'
                                            }, name: 'Font Size', mappingKey: 'fontSize', defaultValue: 40 }),
                                        mappingFormItem('TextArea', { attr: {
                                                autosize: {
                                                    minRows: 1,
                                                    maxRows: 4
                                                },
                                                placeholder: 'Please enter content'
                                            }, name: 'Content', mappingKey: 'text', defaultValue: 'Default Text' }),
                                        mappingFormItem('Color', { name: 'Color', mappingKey: 'style.fill', defaultValue: '#ffffff' }),
                                        mappingFormItem('Color', { name: 'Stroke', mappingKey: 'style.stroke' }),
                                        mappingFormItem('Color', { name: 'Background', mappingKey: 'style.textBackgroundColor' })
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
