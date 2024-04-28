import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import { HashRouter, Route, Router, Routes } from 'react-router-dom';
import Categories from './Home/Categories/Categories';
import Login from './Login_Register/Login';
import Error404 from './commons/Error404';
import Header from './commons/Header';
import ProfilePage from './Profile/ProfilePage';
import Messages from './Messages/Messages';
import Details from "./Details/Details";
import UserPage from './Profile/OtherProfilePage';
import CreateProduct from './Product/CreateProduct';
function App() {
   return (
      <>
         
         <HashRouter>
         <Header />
         <Routes>
            <Route path="/" element={<Categories/>} />
            <Route path="/categories/:category" element={<Categories/>} />
            {/* <Route path="/categories/:category/:id/details" component={Details} />
            <Route path="/categories/:category/:id/edit" component={Edit} /> */}
            <Route path="/login" element = {<Login />}/>
            {/* <Route path="/auth/logout" exact render={LogOut} /> */}
            {/* <Route path='/add-product' element={<CreateSell/>} />; */}
            <Route path="/profile" element={<ProfilePage/>} />
            <Route path="/profile/:username" element={<UserPage/>} />
            {/* <Route path='/profile/:id' element={<ProfilePage isLoggedIn={false}/>} />; */}
            {/* <Route path='/profile/:id/edit' element={<Edit/>} />; */}
            {/* <Route path='/messages' element={<Messages/>} />;
            <Route path='/messages/:id' element={<Messages/>} />; */}
            <Route element={<Error404/>} />
             <Route path="/details/:postId" element={<Details />} />
             <Route path="/add-product" element={<CreateProduct />} />
            </Routes>
         </HashRouter>
      </>
   );
}

export default App;
