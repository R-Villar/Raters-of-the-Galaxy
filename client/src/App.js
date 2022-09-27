import './App.css';
import { useEffect, useState } from 'react'
import {Route, Switch} from "react-router-dom";
import Home from './components/Home';
import Signup from './components/register/Signup';
import Login from './components/register/Login';
import NavBar from './components/NavBar';
import ComicPage from './components/ComicPage';
import DiscussionsPage from './components/discussions/DiscussionsPage';
import ComicDiscussion from './components/discussions/ComicDiscussion';

function App() {
	const [comicData, SetComicData] = useState([]);
	const [currentUser, setCurrentUser] = useState('');
	const [errors, setErrors] = useState([])
	const [selectedComic, setSelectedComic] = useState({});
	const [ selectedDiscussionComic, setSelectedDiscussionComic ] = useState({})
	const [ dbComicData, setDbComicData ] = useState([])
	const [ search, setSearch ] = useState('thor')

	function deletePost(selected) {
		const updatedPosts = selectedDiscussionComic.posts.filter((post) => post.id !== selected) 
		setDbComicData(updatedPosts)
		console.log(updatedPosts)
	}

	// search api
	useEffect(() => {
		fetch(`/api-search/${search}`)
			.then((res) => res.json())
			.then((data) => SetComicData(data));
	}, [search]);


	useEffect(() => {
		fetch("/me").then((res) => {
			if (res.ok) {
				res.json().then((user) => {
					setCurrentUser(user);
				});
			}else {res.json().then((json) => setErrors(json.errors))}
		});
	}, []);

	// adds comic to discussions page.
	const updateDbComics = (addedComic) => {
		setDbComicData([...dbComicData, addedComic])
	}

	// fetch data from DB
	const dBFetch = () => {
		fetch(`/comics`)
			.then((res) => res.json())
			.then((data) => setDbComicData(data));
	} 

	useEffect(() => {
		dBFetch()
	}, []);

  	return (
		<div className='App'>
			<div>
				{currentUser? <h1>Welcome, {currentUser.username}</h1> : null}
			</div>
			<NavBar currentUser={currentUser} setSearch={setSearch} setCurrentUser={setCurrentUser} />
			<Switch>
				<Route exact path='/'>
					<Home
						setSelectedComic={setSelectedComic}
						comicData={comicData}
					/>
				</Route>
				<Route path='/signup'>
					<Signup setCurrentUser={setCurrentUser} />
				</Route>
				<Route path='/login'>
					<Login setCurrentUser={setCurrentUser} />
				</Route>
				<Route path='/comic-page'>
					<ComicPage
						dBFetch={dBFetch}
						updateDbComics={updateDbComics}
						currentUser={currentUser}
						selectedComic={selectedComic}
					/>
				</Route>

				<Route path='/discussions'>
					<DiscussionsPage
						dbComicData={dbComicData}
						setSelectedDiscussionComic={setSelectedDiscussionComic}
					/>
				</Route>
				<Route path={`/comments`}>
					<ComicDiscussion
						currentUser={currentUser}
						dBFetch={dBFetch}
						deletePost={deletePost}
						updateDbComics={updateDbComics}
						selectedDiscussionComic={selectedDiscussionComic}
					/>
				</Route>
			</Switch>
		</div>
  	);
}

export default App;
