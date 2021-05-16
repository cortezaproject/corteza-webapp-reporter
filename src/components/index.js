import Vue from 'vue'
import { FontAwesomeIcon, FontAwesomeLayers } from '@fortawesome/vue-fontawesome'
import PortalVue from 'portal-vue'
import VueTippy, { TippyComponent } from 'vue-tippy'
import './faIcons'
import { components } from '@cortezaproject/corteza-vue'

Vue.use(VueTippy)
Vue.use(PortalVue)
Vue.component('font-awesome-icon', FontAwesomeIcon)
Vue.component('font-awesome-layers', FontAwesomeLayers)
Vue.component('c-permissions-button', components.CPermissionsButton)
Vue.component('c-input-confirm', components.CInputConfirm)
Vue.component('tippy', TippyComponent)
