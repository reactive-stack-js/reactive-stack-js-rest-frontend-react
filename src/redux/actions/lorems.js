export const SET_LOREMS = "SET_LOREMS";
export const setLorems = (lorems) => ({type: SET_LOREMS, payload: lorems});

export const SET_LOREMS_TOTAL_COUNT = "SET_LOREMS_TOTAL_COUNT";
export const setLoremsTotalCount = (totalCount) => ({type: SET_LOREMS_TOTAL_COUNT, payload: totalCount});

export const SET_SELECTED_LOREM = "SET_SELECTED_LOREM";
export const setSelectedLorem = (selected) => ({type: SET_SELECTED_LOREM, payload: selected});

export const SET_SELECTED_LOREM_VERSIONS = "SET_SELECTED_LOREM_VERSIONS";
export const setSelectedLoremVersions = (versions) => ({type: SET_SELECTED_LOREM_VERSIONS, payload: versions});
