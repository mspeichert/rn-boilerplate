import {actions} from './actions'

const initialState = {}

export default (state = initialState, action) => {
    switch (action.type) {
        case actions.LOAD_ITEMS:
            return Object.assign({}, state, {
                items: action.value,
            })
        default:
            return state
    }
}
