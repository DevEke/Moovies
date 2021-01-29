import React, { Component } from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import axios from 'axios';
import MovieCard from '../MovieCard/moviecard';
import MovieView from '../MovieView/movieview';
import LoginView from '../LoginView/loginview';
import RegisterView from '../RegisterView/registerview';
import profile from '../../img/user.svg';
import './mainview.scss';



class MainView extends Component {
    constructor() {
        super();
        this.state = {
            movies: null,
            selectedMovie: null,
            user: null,
            newUser: false
        }
    }

    componentDidMount() {
        let accessToken = localStorage.getItem('token');
        if (accessToken !== null) {
            this.setState({
                user: localStorage.getItem('user')
            });
            this.getMovies(accessToken);
        }
    }

    onMovieClick(movie) {
        this.setState({
            selectedMovie: movie
        });
    }

    goBack() {
        this.setState({
            selectedMovie: null
        });
    }

    onLoggedIn(authData) {
        console.log(authData);
        this.setState({
            user: authData.user.Username,
            newUser: false
        });
        localStorage.setItem('token', authData.token);
        localStorage.setItem('user', authData.user.Username);
        this.getMovies(authData.token);
    }

    getMovies(token) {
        axios.get('https://muvi-app.herokuapp.com/movies', {
            headers: {Authorization: `Bearer ${token}`}
        })
        .then((response) => {
            this.setState({
                movies: response.data
            });
        })
        .catch((error) => {
            console.log(error);
        });
    }

    onRegistered(user) {
        this.setState({
            user: user,
            newUser: false
        })
    }

    onSignOut() {
        localStorage.clear();
        this.setState({
            user: null
        })
    }

    toRegister() {
        this.setState({
            newUser: true
        })
    }

    toLogin() {
        this.setState({
            newUser: false
        })
    }

    render() {
        const { movies, selectedMovie, newUser, user } = this.state;

        if (newUser) return <RegisterView onRegistered={user => this.onRegistered(user)} toLogin={() => this.toLogin()}/>;

        if (!user) return <LoginView onLoggedIn={user => this.onLoggedIn(user)} toRegister={() => this.toRegister()}/>;

        if (!movies) return <div className="main-view"/>;
        

        return (
            <div className="main-view">
                <div className="nav">
                    <h1>MUVI</h1>
                    <div>
                        <button className="account btn">
                            <img src={profile} alt="profile icon"/>
                        </button>
                        <button onClick={() => this.onSignOut()} className="signout btn">Sign Out</button>
                    </div>
                </div>
                <div className="movie-grid">
                    {selectedMovie 
                        ? <MovieView movie={selectedMovie} onClick={() => this.goBack()}/> 
                        : movies.map(movie => (
                            <MovieCard className="moviecard" key={movie._id} movie={movie} onClick={movie => this.onMovieClick(movie)}/>
                        ))
                    }
                </div>         
            </div>
        );
    }
}


export default MainView;