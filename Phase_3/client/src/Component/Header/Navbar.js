import React from 'react'
import { Link } from 'react-router-dom'
import jwt_decode from "jwt-decode";
import Cookies from 'js-cookie'

const Navbar = () => {
    const token = Cookies.get('jwtooken')
    var decodeToken
    if(token){
         decodeToken = jwt_decode(token)
    }
     
    return (
        <>
           
            {Cookies.get('jwtooken') ?

                (<nav className="navbar navbar-expand-md navbar-light bg-light ">
                    <div className="container-fluid">
                        <Link className='navbar-brand logo-font' to='/'>NSL</Link>
                        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                            <span className="navbar-toggler-icon"></span>
                        </button>
                        <div className="collapse navbar-collapse" id="navbarSupportedContent">
                            <ul className="navbar-nav nav ">

                                <>
                                    <li className="nav-item">
                                        <Link className="nav-link" to="/profile"><span className="font-weight-bolder">Profile</span></Link>
                                    </li>
                                    {
                                        (decodeToken.role ==='admin' || decodeToken.role==='teamlead') &&
                                        <>
                                        <li className="nav-item">
                                        <Link className="nav-link" to="/createuser"><span className="font-weight-bolder">Create User</span></Link>
                                        </li>
                                        <li className="nav-item">
                                        <Link className="nav-link" to="/createproject"><span className="font-weight-bolder">Create Project</span></Link>
                                        </li>
                                        </>
                                        
                                    }
                                    {/* <li className="nav-item">
                                        <Link className="nav-link" to="/createuser"><span className="font-weight-bolder">Create User</span></Link>
                                    </li> */}
                                    <li className="nav-item">
                                        <Link className="nav-link" to="/showproject"><span className="font-weight-bolder">Show Project</span></Link>
                                    </li>
                                    <li className="nav-item">
                                        <Link className="nav-link" to="/logout"><span className="font-weight-bolder">Log Out</span></Link>
                                    </li>
                                </>



                            </ul>
                        </div>
                    </div>
                </nav>
                ) :
                (
                    <>
                       
                    </>
                )
            }
        </>
    )
}

export default Navbar