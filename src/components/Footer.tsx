import facebook_white from "../assets/facebook.png";
import discord_white from "../assets/discord.png";

export interface FooterProps {
  address: string;
}

export default function Footer(props: FooterProps) {
  return (
    <footer className="footer">
      <p>
        SMART CONTRACT ADDRESS:&nbsp;
        <br />
        <span>
          <a
            className="decoration-sky-500/30 underline"
            href={`https://mumbai.polygonscan.com/address/${props.address}`}
            target="_blank"
            rel="noreferrer"
          >
            {props.address}
          </a>
        </span>
      </p>
      <div className="flex flex-row justify-center items-center gap-2">
        <div className="w-4">
          <a href="https://discord.com/users/799187521875214346">
            <img src={discord_white} alt="Discord" />
          </a>
        </div>

        <div className="w-4">
          <a
            href="https://www.facebook.com/kazuma.shimomiya"
            target="_blank"
            rel="noreferrer"
          >
            <img src={facebook_white} alt="Facebook" />
          </a>
        </div>
      </div>
    </footer>
  );
}
