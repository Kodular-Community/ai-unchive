import{View}from"../view.js";import{Label,Downloader,AssetFormatter}from"../widgets.js";import{NodeList}from"./node_list.js";import{BlocklyWorkspace}from"../../unchive/ai_project.js";export class Node extends View{static async promiseNode(e,t){return new Node(e,t)}constructor(e,t){super("DIV"),this.captionView=new Label,this.addView(this.captionView),this.addStyleName("unchive-node"),this.subText=t||"",this.setCaption(e)}setCaption(e){this.caption=e,this.captionView.setHTML(e+"<br><small>"+this.subText+"</small>")}setSubText(e){this.subText=e,this.captionView.setHTML(this.caption+"<br><small>"+e+"</small>")}setNodeList(e){this.containerNodeList=e}}export class HeaderNode extends Node{static async promiseNode(e,t){return new HeaderNode(e,t)}constructor(e,t){super(e),this.iconView=new Label('<i class="material-icons">'+t+"</i>",!0),this.insertView(this.iconView,1)}addClickListener(e){this.domElement.addEventListener("click",t=>{e(t)})}}class PropertyNode extends Node{static async promiseNode(e,t){return new PropertyNode(e,t)}constructor(e,t){super(Messages[e+"Properties"]||e),this.captionView.addStyleName("unchive-property-node__property-name"),this.valueView=new Label(t),this.valueView.addStyleName("unchive-property-node__property-value"),this.addView(this.valueView),this.addStyleName("unchive-property-node")}}export class ChainedNode extends Node{static async promiseNode(e,t,s){return new ChainedNode(e,t,s)}constructor(e,t,s){super(e,t),this.addStyleName("unchive-node--chained"),this.arrowLabel=new Label('<i class="material-icons">keyboard_arrow_right</i>',!0),this.arrowLabel.addStyleName("unchive-node__icon--right"),this.addView(this.arrowLabel),this.domElement.addEventListener("click",e=>{this.open()}),this.initializeChain(s)}open(){this.chainNodeList.visible||(this.setChainVisible(!0),this.containerNodeList.activeNode&&this.containerNodeList.activeNode instanceof ChainedNode&&this.containerNodeList.activeNode.setChainVisible(!1),this.containerNodeList.setActiveNode(this))}setChainVisible(e){this.chainNodeList.setVisible(e),e?RootPanel.nodeListContainer.addView(this.chainNodeList):RootPanel.nodeListContainer.hasView(this.chainNodeList)&&(RootPanel.nodeListContainer.removeView(this.chainNodeList),this.chainNodeList.activeNode instanceof ChainedNode&&this.chainNodeList.activeNode.setChainVisible(!1),this.chainNodeList.setActiveNode(void 0))}async initializeChain(e){this.chainNodeList=new NodeList,this.generateChain(e),this.setChainVisible(!1)}async generateChain(e){}}class ComponentNode extends ChainedNode{static async promiseNode(e,t,s){return new ComponentNode(e,t,s)}constructor(e,t,s){super(e,Messages[t.charAt(0).toLowerCase()+t.slice(1)+"ComponentPallette"]||t,s),s.faulty&&(this.arrowLabel.setHTML('<i class="material-icons">error</i>'),this.addStyleName("unchive-node--faulty"))}async generateChain(e){this.generatePropertyNodes(e.properties)}async generatePropertyNodes(e){try{for(let t of e){let s=PropertyNode.promiseNode(t.name,"color"==t.editorType?t.value.replace("&H","#"):t.value);this.chainNodeList.addNodeAsync(s),0==e.indexOf(t)&&s.then(e=>{this.firstPropertyNode=e.domElement,e.addStyleName("unchive-node--first-of-type")})}}catch(e){console.log("Error in "+this.caption+", message: "+e.message)}}}class ContainerNode extends ComponentNode{static async promiseNode(e,t,s){return new ContainerNode(e,t,s)}async generateChain(e){this.createHeader(),this.generateChildNodes(e.children),this.generatePropertyNodes(e.properties),this.header.addClickListener(e=>{this.firstPropertyNode.scrollIntoView({block:"start",behavior:"smooth"})})}async createHeader(){this.header=new HeaderNode("Jump to properties","double_arrow"),this.header.addStyleName("unchive-node--component-container--header"),this.chainNodeList.addNode(this.header)}async generateChildNodes(e){for(let t of e)null!=t.children[0]?this.chainNodeList.addNodeAsync(ContainerNode.promiseNode(t.name,t.type,t)):this.chainNodeList.addNodeAsync(ComponentNode.promiseNode(t.name,t.type,t))}}export class ScreenNode extends ContainerNode{static async promiseNode(e){return new ScreenNode(e)}constructor(e){"Screen1"!=e.name&&(e.form.properties=e.form.properties.filter(e=>"AccentColor"!=e.name&&"AppId"!=e.name&&"Icon"!=e.name&&"MinSdk"!=e.name&&"PackageName"!=e.name&&"PrimaryColor"!=e.name&&"PrimaryColorDark"!=e.name&&"ReceiveSharedText"!=e.name&&"ShowListsAsJson"!=e.name&&"Sizing"!=e.name&&"SplashEnabled"!=e.name&&"SplashIcon"!=e.name&&"Theme"!=e.name&&"TutorialURL"!=e.name&&"VersionCode"!=e.name&&"VersionName"!=e.name)),super(e.name,Messages.screenComponentPallette,e)}async generateChain(e){this.createHeader(),this.chainNodeList.addNode(new WorkspaceNode(e.blocks)),this.generateChildNodes(e.form.children),this.generatePropertyNodes(e.form.properties),this.header.addClickListener(e=>{this.firstPropertyNode.scrollIntoView({block:"start",behavior:"smooth"})})}}class WorkspaceNode extends ChainedNode{static async promiseNode(e){return new WorkspaceNode(e)}constructor(e){super("Blocks","",(new DOMParser).parseFromString(e,"text/xml")),this.chainNodeList.addStyleName("node-list--blocks-list")}async generateChain(e){this.blockNodes=[];for(let t of e.getElementsByTagName("xml")[0].children)if("block"==t.tagName){let e=BlockNode.promiseNode(t);this.blockNodes.push(e),this.chainNodeList.addNodeAsync(e)}}setChainVisible(e){if(super.setChainVisible(e),e)for(let e of this.blockNodes)e.then(e=>{e.initializeWorkspace()})}}class BlockNode extends Node{static async promiseNode(e){return new BlockNode(e)}constructor(e){super(),this.addStyleName("unchive-block-node"),this.workspace=new BlocklyWorkspace(e),this.addView(this.workspace.getWorkspaceView())}initializeWorkspace(){this.workspace.initializeWorkspace(),this.workspace.faulty&&this.addStyleName("unchive-block-node--faulty")}}export class AdditionalListNode extends ChainedNode{static async promiseNode(e,t,s,i){return new AdditionalListNode(e,t,s,i)}constructor(e,t,s,i){super(e,"",[t,s]),this.onOpen=i}async generateChain(e){e[0]&&e[1]&&e[1].call(this,e[0])}setChainVisible(e){super.setChainVisible(e),e&&this.onOpen&&this.onOpen()}}export class ExtensionNode extends Node{constructor(e,t,s){super(e,t),this.addStyleName("unchive-extension-node"),this.descriptionView=new Label(s),this.addView(this.descriptionView)}}export class AssetNode extends Node{constructor(e,t,s,i){AssetNode.initConstants(),super(e+"."+t,""),this.assetName=e+"."+t,this.assetSize=s,this.generatePreview(i,t),this.addStyleName("unchive-asset-node")}generatePreview(e,t){var s;(s=-1!=AssetNode.supportedImageTypes.indexOf(t)?new View("IMG"):-1!=AssetNode.supportedVideoTypes.indexOf(t)?new View("VIDEO"):-1!=AssetNode.supportedAudioTypes.indexOf(t)?new View("AUDIO"):new Label("Asset cannot be previewed. Click to download")).setAttribute("src",e),s.addStyleName("asset-preview"),s.domElement.addEventListener("click",t=>{Downloader.downloadURL(e,this.assetName)}),this.addView(s),this.assetSize>15e6?(this.addStyleName("unchive-asset--large-node"),this.setSubText('<i class="material-icons">warning</i>'+AssetNode.formatAssetSize(this.assetSize))):this.setSubText(AssetFormatter.formatSize(this.assetSize))}static initConstants(){this.supportedImageTypes=["png","jpg","jpeg","gif","svg","bmp"],this.supportedVideoTypes=["mp4","avi","3gp","flv","wmv"],this.supportedAudioTypes=["mp3","ogg","wav","wma"]}}export class SummaryNode extends Node{static async promiseNode(e,t){return new SummaryNode(e,t)}constructor(e,t){super(e,""),this.addStyleName("unchive-summary-node"),this.contentWrapper=new View("DIV"),this.addView(this.contentWrapper),this.contentWrapper.domElement.innerHTML=t}}