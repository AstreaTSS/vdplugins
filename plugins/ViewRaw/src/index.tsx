import { before, after } from "@vendetta/patcher"
import { getAssetIDByName } from "@vendetta/ui/assets"
import { findInReactTree } from "@vendetta/utils"
import { findByName, findByProps } from "@vendetta/metro"
import { React, i18n } from "@vendetta/metro/common"
import { Forms } from "@vendetta/ui/components"
import RawPage from "./RawPage"

const LazyActionSheet = findByProps("openLazy", "hideActionSheet")
const Navigation = findByProps("push", "pushLazy", "pop")
const modalCloseButton =
  findByProps("getRenderCloseButton")?.getRenderCloseButton ??
  findByProps("getHeaderCloseButton")?.getHeaderCloseButton
const Navigator = findByName("Navigator") ?? findByProps("Navigator")?.Navigator
const { FormRow, FormIcon } = Forms

const unpatch = before("openLazy", LazyActionSheet, ([component, key, msg]) => {
    const message = msg?.message
    if (key !== "MessageLongPressActionSheet" || !message) return
    component.then(instance => {
        const unpatch = after("default", instance, (_, component) => {
            React.useEffect(() => () => { unpatch() }, [])
            const buttons = findInReactTree(component, c => c?.find?.(child => child?.props?.label == i18n?.Messages?.MESSAGE_ACTION_REPLY))
            if (!buttons) return

            const position = Math.max(
				        buttons.findIndex((x) => x?.props?.label == i18n?.Messages?.MESSAGE_ACTION_REPLY), 
				        buttons.length - 1
			      );
            const targetPos = position || 1;

            const navigator = () => (
                <Navigator
                    initialRouteName="RawPage"
                    goBackOnBackPress
                    screens={{
                        RawPage: {
                            title: "ViewRaw",
                            headerLeft: modalCloseButton?.(() => Navigation.pop()),
                            render: () => <RawPage message={message} />
                        }
                    }}
                />
            )

           

            buttons.splice(targetPos, 0, (
                <FormRow
                    label="View Raw"
                    leading={<FormIcon style={{ opacity: 1 }} source={getAssetIDByName("ic_chat_bubble_16px")} />}
                    onPress={() => {
                        LazyActionSheet.hideActionSheet()
                        Navigation.push(navigator)
                    }}
                />
            ))
        })
    })
})

export const onUnload = () => unpatch()
