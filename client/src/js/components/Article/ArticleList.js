/**
 * Created by Ondrej on 10/06/2017.
 */
import React from "react";
import {removeDuplicates} from "../../util";
import {serverAddress} from "../../serverConfig";
import Article from "./Article";

export default class ArticleList extends React.Component {
    constructor(props) {
        super(props);
        this.handleScroll = this.handleScroll.bind(this);
        this.loadArticles = this.loadArticles.bind(this);
        this.newArticleHandler = this.newArticleHandler.bind(this);
        this.openArticle = this.openArticle.bind(this);
        window.addEventListener("scroll", this.handleScroll);
        this.state = {token: localStorage.getItem("token"), page: 0, data: [], error: "", openArticle: false};
    }

    componentWillUnmount() {
        window.removeEventListener('scroll', this.handleScroll)
    }

    componentDidMount() {
        if (this.props.location.state) {
            this.setState({articleError: this.props.location.state.error});
            this.props.history.replace({
                pathname: '/vcelin/articles',
                state: {}
            });

        }
        this.loadArticles()
    }

    openArticle(opening, index) {
        if (opening) {
            this.setState({openArticle: index});

        } else {
            this.setState({openArticle: false})
        }

    }

    loadArticles() {
        fetch(`http://${serverAddress}/vcelin/api/articlesPage/${this.state.page}`, {
            method: "GET"
        })
            .then((response) => {
                if (response.ok) {
                    return response.json()
                        .then((json) => {
                            if (json.data) {
                                let data = this.state.data.concat(json.data);
                                data = removeDuplicates(data);

                                this.setState({"data": data});
                            } else {
                                this.setState({error: json.message, lastPage: true})
                            }
                        });
                }
            });


    }

    handleScroll() {

        if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight) {
            if (!this.state.lastPage) {
                this.setState({page: this.state.page + 1});
                this.loadArticles();
            }
        }
    }

    newArticleHandler(e) {
        this.setState({data: [e, ...this.state.data], openArticle: 0});
    }

    render() {
        let articles = null;
        if (!this.state.data) {
            articles = <div>No Articles;(</div>
        } else {
            articles = this.state.data.map((object, i) => {
                return <Article token={this.state.token} articleOpen={this.state.openArticle}
                                handleOpenArticle={this.openArticle}
                                index={i} data={object} key={i}/>;
            })
        }
        return (
            <div className="backgroundDiv">

                {this.state.articleError ?
                    <div className="alert alert-danger"> ERROR: {this.state.articleError}</div> : null}
                <div className="mainHeading">
                    <h1>Articles</h1>
                </div>

                {articles}

                {this.state.error ? <div className="alert alert-info">
                    {this.state.error}
                </div> : null}

            </div>
        )
    }
}
