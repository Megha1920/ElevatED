import styles from "./Navbar.module.css";
import logo from "../../Logo.png";
import miniLogo from "../../../Logo_small.png";
import {
	DashboardLogo,
	ProgressIcons,
	SettingsIcons,
	CoursesIcons,
	StudentList,
} from "../../assets/DashboardIcons";

import navimage from "../../assets/navbarImage.png";
import { Logoutsvg } from "../../assets/svg";
import { useLocation, useNavigate } from "react-router-dom";
import { supabase } from "../../utils/supabase";
import toast from "react-hot-toast";
import RoleChecker from "../RoleChecker/RoleChecker";
import React from "react";

export const Navbar = () => {
	const location = useLocation();

	const navContent = [
		{ title: "home", roleToBeChecked: "dontCheck", icon: DashboardLogo },
		{ title: "courses", roleToBeChecked: "dontCheck", icon: CoursesIcons },
		{
			title: "progress",
			roleToBeChecked: "dontCheck",
			icon: ProgressIcons,
		},
		{
			title: "settings",
			roleToBeChecked: "dontCheck",
			icon: SettingsIcons,
		},
		{
			title: "Students List",
			roleToBeChecked: "enabler",
			icon: StudentList,
		},
		{
			title: "Enabler List",
			roleToBeChecked: "administrator",
			icon: CoursesIcons,
		},
		{
			title: 'Manage Courses',
			roleToBeChecked: "enabler",
			icon: CoursesIcons,
		}
	];

	const getIconColor = (path: string) => {
		return location.pathname.includes(path) ? "#0A8677" : "#A3AED0";
	};
	const navigate = useNavigate();
	return (
		<div className={styles.NavbarWrapper}>
			<div className={styles.TopSection}>
				<img className={styles.MainLogo} src={logo} alt="" />
				<img className={styles.MiniLogo} src={miniLogo} alt="" />
				<div>
					{navContent.map((content, i) =>
						content.roleToBeChecked !== "dontCheck" ? (
							<RoleChecker
								key={i.toString() + content.title}
								checkRoleName={content.roleToBeChecked}
							>
								<>
									<a
										href={`/${content.title
											.toLowerCase()
											.replace(/\s+/g, "")}`}
									>
										{React.createElement(content.icon, {
											colors: getIconColor(
												content.title.toLowerCase()
											),
											key: i,
										})}
										<p
											style={{
												fontSize: "17px",
												fontWeight: 600,
												color: window.location.href.includes(
													`/${content.title
														.toLowerCase()
														.replace(/\s+/g, "")}`
												)
													? "#0A8677"
													: "#A3AED0",
											}}
										>
											{content.title}
										</p>
									</a>
								</>
							</RoleChecker>
						) : (
							<a
								href={`/${content.title
									.toLowerCase()
									.replace(/\s+/g, "")}`}
								key={i.toString() + content.title}
							>
								{React.createElement(content.icon, {
									colors: getIconColor(
										content.title.toLowerCase()
									),
									key: i,
								})}
								<p
									style={{
										fontSize: "17px",
										fontWeight: 600,
										color: window.location.href.includes(
											`/${content.title
												.toLowerCase()
												.replace(/\s+/g, "")}`
										)
											? "#0A8677"
											: "#A3AED0",
									}}
								>
									{content.title}
								</p>
							</a>
						)
					)}
				</div>
			</div>
			<img src={navimage} alt="" />
			<button
				onClick={async () => {
					localStorage.removeItem("accessToken");
					let { error } = await supabase.auth.signOut();
					if (error) {
						toast.error(error.message);
					}
					navigate("/landing");
				}}
			>
				<Logoutsvg />
				<p> Log Out</p>
			</button>
		</div>
	);
};
