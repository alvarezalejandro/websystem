angular.module('Projects').factory('projectService', ['dataService',
    function (dataService) {
        return {
            save: function (convocatory, project, onProjectUpdated) {
                if (convocatory == null)
                    return;
                var referenceName = 'convocatories/' + convocatory + '/projects';
                dataService.saveObject(referenceName, project, onProjectUpdated);
            },
            getProject: function (convocatory,id, callback) {
                dataService.getData('convocatories/'+convocatory+'/projects/' + id, callback);
            },
            getProjects: function(convocatory, callback){
                dataService.getData('convocatories/'+convocatory+'/projects', callback);
            },
            addProduct: function (convocatory, project, product, onProductUpdated) {
                if (project.id == null && convocatory == null)
                    return;
                console.log(project.id+"lala");
                var referenceName = 'convocatories/' + convocatory + '/projects/' + project.id + '/products';
                dataService.saveObject(referenceName, product, onProductUpdated);
            },
            removeProduct: function (convocatory, project, product) {
                if (convocatory == null || project.id == null)
                    return;
                var referenceName =  'convocatories/' + convocatory + '/projects/' + project.id + '/products';
                dataService.deleteObject(referenceName, product);
            },
            agregarParticipante: function (convocatory,project, participante, onProjectUpdated) {
                if (participante.cuilCuit == null || convocatory == null)
                    return;
                var referenceName = 'convocatories/' + convocatory + '/projects/' + project.id + '/participantes';
                dataService.saveObject(referenceName, participante, onProjectUpdated);
            },
            eliminarParticipante: function (convocatory,project, participante) {
                if (convocatory == null || project.id == null)
                    return;
                var referenceName =  'convocatories/' + convocatory + '/projects/' + project.id + '/participantes';
                dataService.deleteObject(referenceName, participante);
            },
            agregarSecretaria: function (convocatory,project, secretaria, onProjectUpdated) {
                if (secretaria.secretaria == null || convocatory == null)
                    return;
                var referenceName = 'convocatories/' + convocatory + '/projects/' + project.id + '/secretarias';
                dataService.saveObject(referenceName, secretaria, onProjectUpdated);
            },
            eliminarSecretaria: function (convocatory,project, secretaria) {
                if (convocatory == null || project.id == null)
                    return;
                var referenceName =  'convocatories/' + convocatory + '/projects/' + project.id + '/secretarias';
                dataService.deleteObject(referenceName, secretaria);
            }
        };
    }
]);

