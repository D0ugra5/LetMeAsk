import copyImg from '../assets/images/copy.svg';
import '../styles/roomCode.scss'
type RoomCodeProps = {
    code: string | undefined
}
export function RoomCode({ code }: RoomCodeProps) {
    
    function copyRoomCodeClipboard() {
       
        navigator.clipboard.writeText(code ? code : '')
    }
    return (
        <button className="room-code" onClick={()=>{copyRoomCodeClipboard()}}>
            <div>
                <img src={copyImg} alt="Copy room code" />
            </div>
            <span>Sala {code}</span>
        </button>
    )
}