'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
/**
 * Reducer for Cascading Pane
 */

var defaultState = { navData: [], mainData: [], subData: {} };
var cascadingPaneReducer = exports.cascadingPaneReducer = function cascadingPaneReducer() {
    var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : defaultState;
    var action = arguments[1];

    var _state = JSON.parse(JSON.stringify(state));
    switch (action.type) {
        case 'RECEIVE_CASCADING_MENU':
            _state.navData = action.payload;
            return _state;
        case 'RECEIVE_CASCADING_MAINVIEW':
            _state.mainData = action.payload;
            return _state;
        case 'RECEIVE_CASCADING_SUBVIEW':
            _state.subData = action.payload;
            return _state;
        default:
            return state;
    }
};