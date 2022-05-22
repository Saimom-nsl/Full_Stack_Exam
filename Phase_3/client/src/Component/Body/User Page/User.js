import React, { useState, useEffect,useContext } from 'react'
import { Modal, Button } from "react-bootstrap";
import { useNavigate } from 'react-router-dom'
import { 
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
 } from 'chart.js';
 import {Bar} from "react-chartjs-2"
import { ProjectContext } from '../../../Context/GlobalContext';
import useToken from '../../../Hooks/useToken'


ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
)
const User = () => {
  const navigate = useNavigate()
  const {isAdmin,isTeamLead,isUser,setAlertData}  = useContext(ProjectContext)
  const jwt = useToken()
  const [show, setShow] = useState(false);
  const [searchData, setSearchData] = useState([])
  const [getData,setUserData] = useState([])
  const [search, setSearch] = useState({
    searchText: ""
  })
  const [label,setLabel] = useState([])
  const [totalContribution,setTotalContribution] = useState([])
  const [chartData,setChartData] = useState({
    datasets:[]
  })


  const [chartOptions,setChartOptions] = useState({})

  let data = {
    labels: getData.map((val) => {
        return (
            val.name
        )
    }),

    datasets: [{
        label: '# of Votes',
        data: getData.map((val) => {
            return (
                val.total
            )
        }),
        backgroundColor: [
            'rgba(255, 99, 132, 0.2)',
            'rgba(54, 162, 235, 0.2)',
            'rgba(255, 206, 86, 0.2)',
            'rgba(75, 192, 192, 0.2)',
            'rgba(153, 102, 255, 0.2)',
            'rgba(255, 159, 64, 0.2)',
            'rgba(255, 159, 64, 0.2)'
        ],
        borderColor: [
            'rgba(255, 99, 132, 1)',
            'rgba(54, 162, 235, 1)',
            'rgba(255, 206, 86, 1)',
            'rgba(75, 192, 192, 1)',
            'rgba(153, 102, 255, 1)',
            'rgba(255, 159, 64, 1)',
            'rgba(255, 159, 64, 1)',

        ],
        borderWidth: 1
    }]
}
  const handleClose = () => setShow(false);


  let name, value
  const eventHandle = (e) => {
    name = e.target.name
    value = e.target.value
    setSearch({ [name]: value })
  }

  const searchProject = async (e) => {
    const { searchText } = search
    e.preventDefault()
    const res = await fetch(`${process.env.REACT_APP_URL}/searchproject`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${jwt}`
      },
      body: JSON.stringify({
        searchText
      }),
    })
    const data = await res.json()
    if (res.status === 400){
      setAlertData({message:data.message, code:"danger"})
      console.log(data.message)
    } 
    else {
      setSearch({
        searchText: ""
      })
      setShow(true)
      setSearchData(data)
      console.log(searchData);
    }
  }


const getContribution = async() =>{

    const res = await fetch(`${process.env.REACT_APP_URL}/getpaperContribution`, {
      method: "GET",
      headers: {
          "Content-Type": "application/json",
          "Authorization":`Bearer ${jwt}`
      } 
  })
  const data = await res.json()
  if (res.status === 400) console.log(data.message)
  else {
    setUserData(data)
    data.map((val,i)=>{
      setLabel(label.push(val._id))
      setTotalContribution(totalContribution.push(val.total))
    })

    setChartData({
      labels:label,
      datasets:[
        {
          label: 'Contribution',
          data:totalContribution,
          borderColor:"rgb(53,162,235)",
          backgroundColor:"rgb(53,162,235,.4)"
        }
      ]
    })

    setChartOptions({
      responsive:true,
      plugins:{
        legend:{
          position:"top"
        },
        title:{
          display:true,
          text:"Contribution"
        }
      }
    })
      // console.log(data);
  }
  }

  useEffect(() => {
    getContribution()
  }, [])
  
  return (
    <>
      <div class="search_wrap search_wrap_1">
        <div class="search_box">
          <input type="text" class="input" name="searchText" value={search.searchText} onChange={eventHandle} placeholder="search title of project" />
          <div class="btn btn_common" onClick={searchProject}>
            <i class="fas fa-search" ></i>
          </div>
        </div>
      </div>

    

      <div>
       
      </div>

      <Bar options={chartOptions} data={chartData}/>
      <Modal show={show}>
        <Modal.Header >
          <Modal.Title>Searched projects</Modal.Title>
        </Modal.Header>
        {
          searchData && searchData.map((val, ind) => {
            return (
              <Modal.Body>
                <>
                  Title: {val.title}
                  <br/>
                  Start Date: {val.startDate.split('T')[0]}
                  <br />
                  End Date : {val.endDate.split('T')[0]}
                  <br/>
                  Team Leader: {val.teamLead.name}
                  <br/>
                  
                </>
              </Modal.Body>
            )
          })
        }

        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>Cancel</Button>
        </Modal.Footer>
      </Modal>
    </>

  )
}

export default User