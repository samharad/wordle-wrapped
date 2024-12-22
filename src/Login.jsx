import React, {useState} from "react";
import {db} from "./instantDb.js";
import {useNavigate} from "react-router";
import {MediumButton} from "./commonComponents.jsx";

function Email({ setSentEmail }) {
  const [email, setEmail] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email) return;
    setSentEmail(email);
    db.auth.sendMagicCode({ email })
      .then(res => {
        console.log(res);
        return res;
      })
      .catch((err) => {
      alert('Uh oh :' + err.body?.message);
      setSentEmail('');
    });
  };

  return (
    <div className={"flex flex-col text-xl"}>
      <div className={"text-white italic rounded m-auto p-3"}>
        To share your World group's wrapped, please authenticate using your email (it's quick!)
      </div>
      <div className={"p-3"}>
        <form onSubmit={handleSubmit} style={{}}>
          <div>
            <input
              className={"text-red p-3 bg-white rounded"}
              placeholder="Enter your email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className={"p-3"}>
            <MediumButton type={"submit"} content={"Send code"}>
            </MediumButton>
          </div>
        </form>
      </div>
    </div>
  );
}

function MagicCode({sentEmail}) {
  const [code, setCode] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    db.auth.signInWithMagicCode({email: sentEmail, code}).catch((err) => {
      alert('Uh oh :' + err.body?.message);
      setCode('');
    });
  };

  return (
    <div className={"flex flex-col text-xl"}>
      <div className={"text-white italic rounded m-auto p-3"}>
        We sent you an email 📧, please enter the code it contains
      </div>
      <div>
        <form onSubmit={handleSubmit} style={{}}>
          <div>
            <input
              className={"text-red p-3 bg-white rounded"}
              type="text"
              placeholder="123456"
              value={code}
              onChange={(e) => setCode(e.target.value)}
            />
          </div>
          <div className={"p-3"}>
            <MediumButton type="submit" content={"Verify"}>
            </MediumButton>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function Login({ histDerived }) {
  const [sentEmail, setSentEmail] = useState(false);
  const navigate = useNavigate();
  const {isLoading, user, error} = db.useAuth();
  if (user) {
    if (histDerived && histDerived.length > 0) {
      navigate("/output");
    } else {
      navigate("/");
    }
  }
  return (
    <div className={"f-full flex flex-col"}>
      <div className="font-bold text-5xl p-6">Login</div>
      {sentEmail
      ? <MagicCode sentEmail={sentEmail} />
      : <Email setSentEmail={setSentEmail}/>}
    </div>
  );
}