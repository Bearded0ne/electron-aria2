import * as React from 'React'
import Snackbar from '@material-ui/core/Snackbar'
import withStyles from '@material-ui/core/styles/withStyles'

import AriaMessages from '../model/ariaMessages'
import NewTaskDialogWithState from '../containers/newTaskDialogWithState'
import SettingsDialogWithState from '../containers/settingsDialogWithState'
import TaskListWithState from '../containers/taskListWithState'
import TopBar from './topBar'
import SideBarWithState from '../containers/sideBarWithState'
import TaskCategoryTabsWithState from '../containers/taskCategoryTabsWithState'
import { ACTIVE, WAITING, COMPLETED, STOPPED, description } from '../model/taskCategory'

const styles = theme => ({
    taskList: {
        [theme.breakpoints.up('sm')]: {
            marginTop: 80
        },
        [theme.breakpoints.down('sm')]: {
            marginTop: 120
        }
    }
})

interface ControlProps {
    hostUrl: string
    token: string
    setUp: Function
    tearDown: Function
    classes: any
    rpc: any
}

interface ControlState {
    newTaskDialogOpen: boolean
    settingsOpen: boolean
    sidebarOpen: boolean
    snackbarOpen: boolean
    category: string
    snackbarText: string
}

class Control extends React.Component<ControlProps, ControlState> {
    constructor(props) {
        super(props)
        this.state = {
            newTaskDialogOpen: false,
            settingsOpen: false,
            sidebarOpen: false,
            snackbarOpen: false,
            snackbarText: undefined,
            category: ACTIVE
        }
    }
    
    handleDialogOpen = () => {
        this.setState({ newTaskDialogOpen: true })
    }
    
    handleDialogClose = () => {
        this.setState({ newTaskDialogOpen: false })
    }

    handleSidebarOpen = () => {
        this.setState({ sidebarOpen: true })
    }

    handleSidebarClose = () => {
        this.setState({ sidebarOpen: false })
    }

    handleSnackbarClose = () => {
        this.setState({ snackbarOpen: false })
    }

    handleCategorySelect = (category) => {
        this.setState({ category, sidebarOpen: false })
    }

    handleSettingsOpen = () => {
        this.setState({ settingsOpen: true })  
    }

    handleSettingsClose = () => {
        this.setState({ settingsOpen: false })        
    }

    componentDidMount() {
        console.log("Control did mount")
        this.props.setUp(
            this.props.hostUrl,
            this.props.token,
            this.onRpcResponse,
            this.onRpcError
        )
    }

    componentWillUnmount() {
        console.log("Control will unmount")
        this.props.tearDown(
            this.props.rpc,
            this.onRpcResponse,
            this.onRpcError
        )
    }

    componentWillUpdate = (nextProps) => {

    }

    onRpcResponse = (method, args, response) => {
        console.log(args)
        console.log(response)
        const func = AriaMessages[method]
        if (func !== undefined) {
            this.setState({
                snackbarOpen: true,
                snackbarText: func(args, response)
            })
        } else {
            console.log(method)
            console.log(response)
            this.setState({
                snackbarOpen: true,
                snackbarText: `${method.replace("aria2.", "")} succeeded`
            })
        }
    }

    onRpcError = (_method, _args, error) => {
        this.setState({ snackbarOpen: true, snackbarText: "Error: " + error.message })
    }
    
    render() {
        const { classes } = this.props
        return (
            <div>
                <TopBar
                    showAddNewTask={this.handleDialogOpen}
                    showMenu={this.handleSidebarOpen}
                    showSettings={this.handleSettingsOpen}
                    title={description[this.state.category]}
                    tabs={<TaskCategoryTabsWithState
                        onCategorySelected={this.handleCategorySelect}
                        category={this.state.category}
                    />}
                />
                <SideBarWithState
                    open={this.state.sidebarOpen}
                    onClose={this.handleSidebarClose}
                    onCategorySelected={this.handleCategorySelect}
                    category={this.state.category}
                />
                <div className={classes.taskList}>
                    <TaskListWithState category={this.state.category} />
                </div>
                <NewTaskDialogWithState
                    open={this.state.newTaskDialogOpen}
                    onRequestClose={this.handleDialogClose}
                />
                <SettingsDialogWithState
                    open={this.state.settingsOpen}
                    onRequestClose={this.handleSettingsClose}
                />
                <Snackbar
                    open={this.state.snackbarOpen}
                    autoHideDuration={5000}
                    onClose={this.handleSnackbarClose}
                    message={<span>{this.state.snackbarText}</span>}
                />
            </div>
        )
    }
}

export default withStyles(styles)(Control)