import { connect } from "react-redux"

import TaskCategoryTabs from "../views/taskCategoryTabs"

function mapStateToProps(state) {
    return {
        tasks: state.tasks
    }
}
  
export default connect(mapStateToProps)(TaskCategoryTabs)