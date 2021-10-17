export const state = {
    publishRecord: [],
    wsRes: {},
};
export const actions = {};

export const mutations = {
    setWsRes(state, payload) {
        state.wsRes = payload;
    },
    updateRecord(state, payload) {
        let data = state.publishRecord
        Object.values(data).forEach((item) => {
            let id = payload.content.id ?? 0
            let status = payload.content.status ?? 0
            if(status != 0 && item.id == id) {
                item.status = status
            }
        })
    }
};
export const getters = {};

export default {
    state,
    actions,
    mutations,
    getters,
    namespaced: true,
};