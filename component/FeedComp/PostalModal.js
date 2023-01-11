import { useState } from "react";
import ReactPlayer from "react-player";
// import { connect } from "react-redux";
// import Firebase from "firebase";
import styled from "styled-components";
import {useSelector} from 'react-redux';
import {convertToBase64} from '../../utils/imageTourl';
import {category_Data,allCategory} from '../category/category_data'



function PostalModal(props) {
    const user = useSelector((state)=>state.user);
	const [editorText, setEditorText] = useState("");
	const [imageFile, setImageFile] = useState("");
	const [videoFile, setVideoFile] = useState("");
	const [urlFile, setUrlFile] = useState("");
	const [assetArea, setAssetArea] = useState("");
	const [showCategory,setShowCategory] = useState(false);
	const [options,setOptions] = useState([]);
	const [domainCat,setDomainCat] = useState(category_Data["Academics"]);
	const [selectedCats,setselectedCats] = useState(new Set());
	const[toggle,setToggle] = useState(0);
	

	const reset = (event) => {
		setEditorText("");
		setImageFile("");
		setVideoFile("");
		setAssetArea("");
		setselectedCats(new Set());
		setShowCategory(false);
		props.clickHandler(event); 
	};

	async function handleImage(event) {
		let image = event.target.files[0];

		if (image === "" || image === undefined) {
			alert(`Not an image. This file is: ${typeof imageFile}`);
			return;
		}
		if(image.type.substring(0,5)==="image"){
			const base64= await convertToBase64(image);
			setImageFile(base64);
		}else{
			 const base64= await convertToBase64(image); //video
			setVideoFile(base64);
		}
	}

	function switchAssetArea(area) {
		setImageFile("");
		setVideoFile("");
		setAssetArea(area);
	}

	const HandleMainCategory = ()=>{
		let arr=[];
		for(let x in category_Data){
			arr.push(x);
		}
		return(
			<>	
				{arr.map((data,idx)=>(
					<button key={idx} style={{backgroundColor:toggle===idx?"green":"white"}} onClick={()=>{setDomainCat(category_Data[data]),setToggle(idx)}}>{data}</button>
				))}
			</>
		)
	}
	const HandleSubCategories = ()=>{
		 return(
			<>	
				{domainCat.map((data,idx)=>(
					<button key={idx} style={{backgroundColor:selectedCats.has(data.toLowerCase())?"blue":"white"}}onClick={()=>handleCatClick(data)}>{data}</button>
				))}
			</>
		)
	}
	const handleCatClick = (data)=>{
		setselectedCats(previousState => new Set([...previousState, data.toLowerCase()]));
	}

	const handleSearch = (e)=>{
		const  text = e.target.value.toLowerCase();
		if(text.length===0){
			setOptions([]); 
			return;
		}
		let arr=[];
		allCategory.map((data)=>{
		let str = data.toLowerCase();
		if(str.search(text)!==-1){
			arr.push(str);
		}})
		setOptions(arr); 
		console.log(options)
	}

	function handleNext(){
		setShowCategory(true);
	}
	async function postArticle(event) {
		event.preventDefault();
		if (event.target !== event.currentTarget) {
			return;
		}
		 
		const payload = {
			image: imageFile,
			video: videoFile,
			url:urlFile,
			description: editorText,
			user: user._id,
			categoryIds:selectedCats,
		};
		console.log(payload);
		reset(event);
	}

	return (
		<>
			{props.showModal === "open" && showCategory===false && (
				 
				<Container>
					<Content>
						<Header>
							<h2>Create a post</h2>
							<button onClick={(event) => reset(event)}>
								<img src="/images/close-icon.svg" alt="" />
							</button>
						</Header>
						 
                        <SharedContent>
							<UserInfo>
								{user.profilePic ? <img src={user.profilePic} alt="" /> : <img src="/images/user.svg" alt="" />}
								<span>{user.name ? user.name : "Name"}</span>
							</UserInfo>
							<Editor>
								<textarea value={editorText} onChange={(event) => setEditorText(event.target.value)} placeholder="What do you want to talk about?" autoFocus={true} />

								{assetArea === "image" ? (
									<UploadImage>
										<input type="file" accept="image/gif, image/jpeg, image/png,video/*" name="image" id="imageFile" onChange={handleImage} style={{ display: "none" }} />
										<p>
											<label htmlFor="imageFile">Select an image/video to share</label>
										</p>
										{imageFile && <img src={ imageFile} alt="" />}
										{videoFile && <ReactPlayer width={"100%"} url={videoFile} />}
									</UploadImage>
								) : (
									assetArea === "video" && (
										<>
											<input
												type="text"
												name="video"
												id="videoFile"
												value={urlFile}
												placeholder="Enter the url link to share"
												onChange={(event) => setUrlFile(event.target.value)}
											/>
											{urlFile && <ReactPlayer width={"100%"} url={urlFile} />}
										</>
									)
								)}
							</Editor>
						</SharedContent>

						<ShareCreation>
							<AttachAsset>
								<AssetButton onClick={() => switchAssetArea("image")}>
									<img src="/images/share-image.svg" alt="" />
								</AssetButton>
								<AssetButton onClick={() => switchAssetArea("video")}>
									<img src="/images/share-video.svg" alt="" />
								</AssetButton>
							</AttachAsset>
							<PostButton  disabled={!editorText ? true : false} onClick={(event) => handleNext()}>
								next
							</PostButton>
						</ShareCreation>
					</Content>
				</Container>	
			)}
			{props.showModal === "open" && showCategory===true && (
				<Container>
				<Content>
					<Header>
						<h2>Plz choose category related to post </h2>
						<button onClick={(event) => reset(event)}>
							<img src="/images/close-icon.svg" alt="" />
						</button>
					</Header>

					<CategorySection>
						<input type='text'placeholder="Search your category" onChange={(e)=>handleSearch(e)}/>
						
						{options.length>=1 && 
						<Option>{
							options.map((data,idx)=>(
								<>
									<button key={idx} style={{backgroundColor:selectedCats.has(data)?"blue":"white"}}onClick={()=>handleCatClick(data)}>{data}</button>
								</>
							))	
						}
						</Option>}
						<Categories>
							  <HandleMainCategory/>
						</Categories>
						<SubCategory>
							 <HandleSubCategories/>
						</SubCategory>
					</CategorySection>

					<ShareCreation>
						<PostButton  disabled={!editorText ? true : false} onClick={(event) => postArticle(event)}>
							next
						</PostButton>
					</ShareCreation>
				</Content>
			</Container>	
			)}
		</>
	);
}

export default PostalModal;


//----------------------------------CSS-----------------------------
const CategorySection = styled.div`
	position:relative;
	height:80vh;
	width:100%;
	border:1px solid grey;
	display:flex;
	flex-direction:column;
	align-items:center;
	input{
		padding-left:20px;
		margin-top:10px;
		height:10%;
		width:70%;
		border-radius:30px;
		border:0.3px solid grey;
	}
`;
const Option = styled.div`
		top:14%;
		z-index:3;
		background-color:white;
		position:absolute;
		height:fit-content;
		width:90%;
		border:1px solid red;
		display:flex;
		flex-wrap:wrap;
		button{
			height:12%;
			width:fit-content;
			min-width:15%;
			padding:2px;
			background:#e6e5e5;
			margin:10px;
		}

`;
const Categories = styled.div`
	margin-top:10px;
	height:15%;
	width:90%;
	border:1px solid grey;
	display:flex;
	align-items:center;
	overflow:scroll;
	::-webkit-scrollbar {
		width: 0px;
		height:0px;
		background: transparent;
	}
	button{
		height:70%;
		padding:10px;
		border-radius:10px;
		margin:0px 5px;
		background:transparent;
		cursor:pointer;
		border:1px solid grey
	}
`;
const SubCategory = styled.div`
	height:80%;
	width:100%;
	border:1px solid red;
	display:flex;
	justify-content:space-evenly;
	flex-wrap:wrap;
	
	button{
		height:12%;
		width:fit-content;
		min-width:15%;
		padding:2px;
		background:#e6e5e5;
		margin:10px;
	}
`;
const Container = styled.div`
	position: fixed;
	top: 0;
	bottom: 0;
	left: 0;
	right: 0;
	z-index: 11;
	background-color: rgba(0, 0, 0, 0.8);
	animation: fadeIn 0.3s ease;
`;

const Content = styled.div`
	width: 100%;
	max-width: 552px;
	max-height: 90%;
	background-color: #fff;
	overflow: initial;
	border-radius: 5px;
	position: relative;
	display: flex;
	flex-direction: column;
	top: 32px;
	margin: 0 auto;
`;

const Header = styled.div`
	display: block;
	padding: 10px 20px;
	border-bottom: 1px solid rgba(0, 0, 0, 0.15);
	font-size: 20px;
	line-height: 1.5;
	color: rgba(0, 0, 0, 0.9);
	display: flex;
	justify-content: space-between;
	align-items: center;
	h2 {
		font-weight: 400;
	}
	button {
		width: 40px;
		height: 40px;
		min-width: auto;
		border: none;
		outline: none;
		background: transparent;
		img,
		svg {
			pointer-events: none;
		}
	}
`;

const SharedContent = styled.div`
	display: flex;
	flex-direction: column;
	flex-grow: 1;
	overflow-y: auto;
	vertical-align: baseline;
	background: transparent;
	padding: 5px 12px;
`;

const UserInfo = styled.div`
	display: flex;
	align-items: center;
	padding: 10px 24px;
	img {
		width: 48px;
		height: 48px;
		background-clip: content-box;
		border-radius: 50%;
		border: 2px solid transparent;
	}
	span {
		font-weight: 600;
		font-size: 16px;
		line-height: 1.5;
		margin-left: 5px;
	}
`;

const ShareCreation = styled.div`
	display: flex;
	justify-content: space-between;
	padding: 10px 24px 10px 16px;
`;

const AttachAsset = styled.div`
	display: flex;
	align-items: center;
`;

const AssetButton = styled.button`
	display: flex;
	align-items: center;
	height: 40px;
	min-width: auto;
	margin-right: 8px;
	border-radius: 50%;
	border: none;
	outline: none;
	justify-content: center;
	background: transparent;
	&:hover {
		background: rgba(0, 0, 0, 0.08);
	}
`;

const ShareComment = styled.div`
	padding-left: 8px;
	margin-right: auto;
	border-left: 1px solid rgba(0, 0, 0, 0.08);
	${AssetButton} {
		border-radius: 50px;
		padding: 5px 10px;
		span {
			font-size: 16px;
			font-weight: 600;
			color: rgba(0, 0, 0, 0.6);
			padding: 0 5px;
		}
	}
`;

const PostButton = styled.button`
	min-width: 60px;
	padding: 0 16px;
	border-radius: 20px;
	background: ${(props) => (props.disabled ? "#b8b8b8" : "#0a66c2")};
	color: ${(props) => (props.disabled ? "#5a5a5a" : "#fff")};
	font-size: 16px;
	letter-spacing: 1.1px;
	border: none;
	outline: none;
	&:hover {
		background: ${(props) => (props.disabled ? "#b8b8b8" : "#004182")};
	}
`;

const Editor = styled.div`
	padding: 12px 24px;
	textarea {
		width: 100%;
		min-height: 100px;
		resize: none;
	}
	input {
		width: 100%;
		height: 35px;
		font-size: 16px;
		margin-bottom: 20px;
	}
`;

const UploadImage = styled.div`
	text-align: center;
	img {
		width: 100%;
	}
`;