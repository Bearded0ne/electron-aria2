import { connect } from "react-redux"

import SideBar from "./sideBar.jsx"

function mapStateToProps(state) {
    return {
        tasks: state.tasks
    }
}

export default connect(mapStateToProps)(SideBar)