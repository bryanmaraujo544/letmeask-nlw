import { BrowserRouter, Route, Switch } from 'react-router-dom'
import { Home } from './pages/Home'
import { NewRoom } from './pages/NewRoom'
import {Room} from './pages/Room'
import { AuthContextProvider } from './contexts/AuthContext'
import { AdminRoom } from './pages/AdminRoom'
import {DarkButton} from './components/DarkButton'
import { useState } from 'react'

import cn from 'classnames'


function App() {
  const [darkState, setDarkState] = useState(false);
  const [changedDarkState, setChangedDark] = useState(false)
  


  function changeTheme(){
        if(changedDarkState){
            setChangedDark(false)
            setDarkState(false)

        } else{
            setChangedDark(true)
            setDarkState(true)
        }
        
  }


  

  return (
    <BrowserRouter>
      
        <AuthContextProvider>
        {/* O switch permite apenas um rota ser acessada */}
        <div 
              className={
                cn (
                  'mainDiv',
                  {darkMode: darkState}
                )
              }
            >

              <DarkButton 
                className={
                  cn(
                    'buttonTheme',
                    {dark: changedDarkState}
                  )
                }
                changedDark={darkState}
                onClick={changeTheme}
              />
        <Switch>
            
              <Route path="/" exact component = {Home}/>
              <Route path="/rooms/new"  component = {NewRoom}/>
              <Route path="/rooms/:id" component = { Room }/>
              <Route path="/admin/rooms/:id" component = {AdminRoom}/>
            
        </Switch>
        </div>
      </AuthContextProvider>
      
      
    </BrowserRouter>
  );
}

export default App;

