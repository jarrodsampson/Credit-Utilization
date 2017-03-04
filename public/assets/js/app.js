$(document).ready(function(){
    $(document).foundation();
});

// get transitions initialized
var ReactCSSTransitionGroup = React.addons.CSSTransitionGroup;

var progressStyle = {
    width: '1%'
};

var CreditBox = React.createClass({
    getInitialState: function() {

        return {
            data: [],
            total: 0,
            balanceAmount : 0,
            ccu: 0

        };
    },
    componentDidMount: function() {
    },
    removeItem: function (i) {
        // removal of item from main component

        console.log(this.state.data[i]);
        this.state.total -= this.state.data[i].limit;
        this.state.balanceAmount -= this.state.data[i].balance;

        // error checking on card removal
        if (isNaN(this.state.ccu))
        {
            this.state.ccu = 0;
        }
        else if (this.state.balanceAmount == 0 || this.state.total == 0) {
            this.state.ccu = 0;
        } else {
            this.state.ccu = this.state.balanceAmount / this.state.total * 100;
        }

        this.setState({
            total: this.state.total,
            balanceAmount: this.state.balanceAmount,
            ccu: this.state.ccu,
            data : React.addons.update( this.state.data , { $splice : [[i,1]] }  )
        });

        alertify.log( 'Card Removed: ' + this.state.data[i].name, 'info' );

        progressStyle = {
            width: this.state.ccu + '%'
        };

    },
    addCard: function(e) {
        e.preventDefault();

        // adding credit card

        if (typeof this.state.name == "undefined"
            || this.state.name.length <= 1
            || typeof this.state.limit == "undefined"
            || isNaN(this.state.limit)
            || this.state.limit == 0
            || typeof this.state.balance == "undefined"
            || isNaN(this.state.balance)) {

            alertify.log( 'Please Add Valid Information.', 'info' );

        } else {

            var cardObj = {
                id: this.state.data.length + 1,
                name:this.state.name,
                balance:parseFloat(this.state.balance),
                limit:parseFloat(this.state.limit)
            };

            this.state.total += cardObj.limit;
            this.state.balanceAmount += cardObj.balance;
            this.state.ccu = this.state.balanceAmount / this.state.total * 100;

            this.setState({
                total: this.state.total,
                balanceAmount: this.state.balanceAmount,
                ccu: this.state.ccu,
                data : this.state.data.concat([cardObj])
            });

            alertify.log( 'Credit Card Added: ' + this.state.name, 'info' );

            this.state.name = "";
            this.state.limit = "";
            this.state.balance = "";

            console.log("Added New Credit Card", this.state.data);

            progressStyle = {
                width: this.state.ccu + '%'
            };

        }


    },
    clearAllExpenses: function () {
        // confirm to remove all

        //var con = confirm("Are you sure you want to remove Everything?");
        //if (con) {
        // clear all data
        this.setState({
            data: [],
            total: 0,
            balanceAmount: 0,
            ccu: 0
        });

        progressStyle = {
            width: '1%'
        };

        alertify.log( 'All Cards Removed.', 'info' );
        //}
    },
    toggleAdd: function() {
        this.setState({childAddVisible: !this.state.childAddVisible});
    },
    onNameChange: function(e) {
        this.setState({name: e.target.value});
    },
    onBalanceChange: function(e) {
        this.setState({balance: e.target.value});
    },
    onLimitChange: function(e) {
        this.setState({limit: e.target.value});
    },
    render: function() {
        return (
            <div className="creditBox">

            <div className="row">

            <ReactCSSTransitionGroup
        transitionName="example2"
        transitionAppear={true}
        transitionEnterTimeout={5100}
        transitionAppearTimeout={5100}
        transitionLeaveTimeout={5100}>

            <div className="small-12 medium-12 large-12 columns">
            <h2>Credit Utilization</h2>
        <blockquote>
        Helping you better understand your credit.
        </blockquote>
        </div>

        </ReactCSSTransitionGroup>

        <div className="small-12 medium-12 large-12 columns">

            <ReactCSSTransitionGroup
        transitionName="example"
        transitionAppear={true}
        transitionEnterTimeout={5100}
        transitionAppearTimeout={5100}
        transitionLeaveTimeout={5100}>

            <p>
            <span className="credit">
        { this.state.balanceAmount == 0 ?
            'Overall Utilization 0.00%'
            :
        'Overall Utilization ' + parseFloat(this.state.ccu).toFixed(2) + '%'
    }
        </span><br />
        <span className="infoBar">
            { parseFloat(this.state.ccu).toFixed(2) > 30 ? 'Credit Card Utilization is too high, lenders prefer to see this under 30%.' : ''}
        { parseFloat(this.state.ccu).toFixed(2) > 20 && parseFloat(this.state.ccu).toFixed(2) <= 30 ? 'Your Utilization is fine, typically not a concern until above 30%.' : ''}
        { parseFloat(this.state.ccu).toFixed(2) > 4 && parseFloat(this.state.ccu).toFixed(2) <= 20 ? 'Utilization is doing okay,  lenders like to see that you can manage a reasonable debt responsibly.' : ''}
        { parseFloat(this.state.ccu).toFixed(2) > 0 && parseFloat(this.state.ccu).toFixed(2) <= 4 ? 'Great Utilization! Lenders like to see that you can manage a reasonable debt.' : ''}
        { this.state.ccu == 0 ? 'No Advice yet, please fill out some credit card info to get started!' : ''}
        </span>


        </p>

        <div className="small-12 medium-12 large-12 columns">
            <div className="progress" role="progressbar" aria-valuemax="100">
            <span className="progress-meter" style={progressStyle}>
            <p className="progress-meter-text">{parseFloat(this.state.ccu).toFixed(2)}%</p>
        </span>
        </div>
        </div>

        </ReactCSSTransitionGroup>
        </div>

        <div className="small-6 medium-6 large-6 columns">
            <div className="small-12 medium-12 large-12 columns">

            <div className="small-6 medium-6 large-6 columns">
            <p>Credit Limit: ${ parseFloat(this.state.total).toFixed(2)}</p>
        </div>

        <div className="small-6 medium-6 large-6 columns">
            <p>Balance: ${ parseFloat(this.state.balanceAmount).toFixed(2) }</p>
        </div>

        </div>
        <div className="small-12 medium-12 large-12 columns">
            <div>
            {/* Add A new Item */}
            <button className="primary button" onClick={ this.toggleAdd }>Add New</button>&nbsp;
        {/* Delete Everything! */}
        <button className="secondary button" onClick={ this.clearAllExpenses } disabled={this.state.data.length <= 0}>Erase All</button>
        </div>

        { this.state.childAddVisible ?
        <form onSubmit={this.addCard}>
        <div className="small-12 medium-12 large-12 columns">
            <div className="small-12 medium-12 large-12 columns">
            <input type="text" onChange={this.onNameChange} value={this.state.name} placeholder="Card Name" maxLength="50" />
            </div>
            <div className="small-12 medium-12 large-12 columns">
            <input type="text" onChange={this.onLimitChange} value={this.state.limit} placeholder="Credit Limit" maxLength="8" />
            </div>
            <div className="small-12 medium-12 large-12 columns">
            <input type="text" onChange={this.onBalanceChange} value={this.state.balance} placeholder="Current Balance" maxLength="8" />
            </div>
            </div>

            <button className="primary button">Add Card</button>
        </form>

        : null }

        </div>

        </div>

        <div className="small-6 medium-6 large-6 columns">

            <div className="small-12 medium-12 large-12 columns">
        <p>
        {this.state.data.length == 1 ? (this.state.data.length) + ' Credit Card Added.' : '' }
        {this.state.data.length > 1 ? (this.state.data.length) + ' Credit Cards Added.' : '' }
        {this.state.data.length <= 0 ? 'No Credit Cards Added.' : '' }
        </p>
        </div>

        <div className="small-12 medium-12 large-12 columns">

            {/* animation fade for list */}

            <ReactCSSTransitionGroup
        transitionName="example2"
        transitionAppear={true}
        transitionEnterTimeout={5100}
        transitionAppearTimeout={5100}
        transitionLeaveTimeout={5100}>

            <CardList
        data={this.state.data}
        onRemoveItem={this.removeItem}
        />

        </ReactCSSTransitionGroup>
        </div>

        </div>

        </div>




        </div>
        );
    }

});

var CardList = React.createClass({
    removeItem: function(i) {
        this.props.onRemoveItem(i);
    },
    render: function() {
        var rows = [];
        this.props.data.map(function(cards, i) {

            // gather data from the JSON file here after filtering
            rows.push(<Card
            id={cards.id}
            key={cards.id}
            name={cards.name}
            limit={cards.limit}
            balance={cards.balance}
            onClick={this.removeItem.bind(this, i)} />);

        }.bind(this));
        //console.log(rows);
        // show UI feedback if there are no rows in the result set
        if (rows.length >= 1) {
            return (
                <table className="cardList hover">
                <thead>
                <tr>
                <th>Name</th>
                <th>Balance</th>
                <th>Limit</th>
                <th>Utilization</th>
                <th>Action</th>
                </tr>
                </thead>
                <tbody>
                {rows}
                </tbody>
                </table>
        );
        } else {
            return (

                <table className="mails">
                <thead>
                <tr>
                <th>Name</th>
                <th>Balance</th>
                <th>Limit</th>
                <th>Utilization</th>
                <th>Action</th>
                </tr>
                </thead>
                <tbody>
                <tr>
                <td><p><em>No Cards Found.</em></p></td>
            </tr>
            </tbody>
            </table>
        );
        }

    }
});

var Card = React.createClass({

    viewDetails: function (data) {

        // view details of object
        var info = data.name + "\n" +
            data.limit + "\n" +
            data.balance;

        var infoHTML = data.name + "<br />" +
            "$" + data.limit + "</br />" +
            "$" + data.balance;
        //alert(info);
        console.log(info);

        alertify.log( infoHTML, 'info' );

    },

    render: function() {
        // the component to display the data here
        return (
            <tr className="card">
            <td>
            { this.props.name }
        </td>
        <td>
        ${parseFloat(this.props.balance).toFixed(2)}
        </td>
        <td>
        ${parseFloat(this.props.limit).toFixed(2)}
        </td>
        <td>
        {parseFloat(this.props.balance / this.props.limit * 100).toFixed(2) }%
        </td>
        <td>
        <button className="primary button" onClick={ this.props.onClick }>
        <i className="fi-trash"></i>
            </button>&nbsp;
        <button className="primary button" onClick={ this.viewDetails.bind(this, this.props) }>
        <i className="fi-magnifying-glass"></i>
            </button>
            </td>
            </tr>
        );
    }
});

ReactDOM.render(
<CreditBox />,
    document.getElementById('creditContentApp')
);