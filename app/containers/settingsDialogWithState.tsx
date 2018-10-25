import { connect } from "react-redux"

import SettingsDialog from "../views/settingsDialog"
import { arbitraryValChanged } from "../actions"

function mapStateToProps(state) {
    return {
        defaultDir: state.defaultDir
    }
}

function mapDispatchToProps(dispatch) {
    return {
        setDefaultDir: (dir) => {
            dispatch(arbitraryValChanged("defaultDir", dir))
        }
    }
}
  
export default connect(mapStateToProps, mapDispatchToProps)(SettingsDialog)