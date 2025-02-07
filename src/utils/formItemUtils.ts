import FormItem from '@/components/item/formItem/FormItem.vue';
/**
 * Provide default configuration, system configurations can be placed in baseOptions instead of writing them directly in configuration files
 * The purpose is to simplify property configuration files, keeping only key information
 * */
const BaseOptionConfig: Record<string, any> = {
    Collapse: {
        component: FormItem,
        dataType: 'Collapse',
        defaultValue: 0
    },
    CollapsePane: {
        component: FormItem,
        dataType: 'CollapsePane'
    },
    Tabs: {
        component: FormItem,
        dataType: 'Tabs',
        defaultValue: 0
    },
    TabPane: {
        component: FormItem,
        dataType: 'TabPane'
    },
    TabsCard: {
        component: FormItem,
        dataType: 'Tabs',
        defaultValue: 0,
        attr: {
            type: 'border-card'
        }
    },
    Slider: {
        component: FormItem,
        dataType: 'Slider'
    },
    String: {
        component: FormItem,
        dataType: 'String'
    },
    Number: {
        component: FormItem,
        dataType: 'Number'
    },
    Radio: {
        component: FormItem,
        dataType: 'Radio'
    },
    RadioItem: {
        component: FormItem,
        dataType: 'RadioItem'
    },
    RadioButton: {
        component: FormItem,
        dataType: 'RadioButton'
    },
    RadioButtonItem: {
        component: FormItem,
        dataType: 'RadioButtonItem'
    },
    Boolean: {
        component: FormItem,
        dataType: 'Boolean'
    },
    Color: {
        component: FormItem,
        dataType: 'Color'
    },
    TextArea: {
        component: FormItem,
        dataType: 'TextArea'
    },
    Flex: {
        component: FormItem,
        dataType: 'Flex'
    }
};

// Format property form configuration
export function mappingFormItem(componentName: string, mergeOptions: Record<string, any>) {
    return {
        ...(BaseOptionConfig[componentName] || {}),
        ...mergeOptions
    };
}
