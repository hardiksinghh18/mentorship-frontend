const initialState = {
    hideMobileNav: false
};

const uiReducer = (state = initialState, action) => {
    switch (action.type) {
        case 'SET_HIDE_MOBILE_NAV':
            return {
                ...state,
                hideMobileNav: action.payload
            };
        default:
            return state;
    }
};

export default uiReducer;
