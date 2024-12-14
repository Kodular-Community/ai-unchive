import {Project} from "aia-kit";

export function getPackageName(project: Project) {
    let mainClass = project.properties.main;
    return mainClass.split('.').slice(0, -1).join('.');
}
