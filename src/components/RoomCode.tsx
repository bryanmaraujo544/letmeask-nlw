import '../styles/room-code.scss';
import copyImg from "../assets/images/copy.svg";

type RoomCodeProps = {
    code: string;
}

export function RoomCode(props: RoomCodeProps){
    function copyRoomCode(){
        navigator.clipboard.writeText(props.code);
    }

    return (
        <button className="room-code" onClick={copyRoomCode}> 
            <div>
                <img src={copyImg} alt="" />
            </div>
            <span>Sala #{props.code}</span>
        </button>
    )
}