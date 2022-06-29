import copyImg from '../assets/images/copy.svg';
import toast, { Toaster } from 'react-hot-toast';
import '../styles/roomCode.scss'
type RoomCodeProps = {
    code: string | undefined
}
export function RoomCode({ code }: RoomCodeProps) {

    function copyRoomCodeClipboard() {
        navigator.clipboard.writeText(code ? code : '');
        toast('Codigo Copiado', {
            icon: '✔',
            style: {
                borderRadius: '10px',
                background: '#fff',
                color: '#835afd',
            },
        })
    }
    return (<>
        <Toaster
            position="top-center"
            reverseOrder={false}
        />
        <button className="room-code" onClick={() => { copyRoomCodeClipboard() }}>
            <div>
                <img src={copyImg} alt="Copy room code" />
            </div>
            <span>Sala {code}</span>
        </button>
    </>
    )
}