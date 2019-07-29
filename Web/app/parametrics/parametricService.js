'use strict';

angular.module('Parametrics').factory('parametricService', ['dataService',
    function (dataService) {
        return {
            getParametrics: function(callback) {
                dataService.getData('parametrics', callback);
            },
            getParametricTypes: function()
            {
                return {
                    university : {page:'formation', type: 'university',name: 'Universidad', listTitle: 'Universidades disponibles', newTitle: 'Agregar nueva Universidad' },
                    typeOfRecruitment : {page:'position', type: 'typeOfRecruitment',name: 'Tipo de Contratación', listTitle: 'Tipo de Contratación disponibles', newTitle: 'Agregar nuevo Tipo de Contratación' },
                    academicDegree : {page:'formation', type: 'academicDegree',name: 'Grado de Titulación', listTitle: 'Títulos académicos disponibles', newTitle: 'Agregar nuevo grado de titulación' },
                    career: {page:'formation', type: 'career', name: 'Carrera', listTitle: 'Carreras disponibles', newTitle: 'Agregar nueva carrera'},
                    undavCareer: {page:'position', type: 'undavCareer', name: 'Carrera de UNDAV', listTitle: 'Carreras disponibles', newTitle: 'Agregar nueva carrera'},
                    degreeArea: {page:'formation', type: 'degreeArea', name: 'Gran Area de Conocimiento', listTitle: 'Grandes Areas de Conocimiento disponibles', newTitle: 'Agregar nueva gran area de conocimiento disponible'},
                    idDedication: {page:'position', type: 'idDedication', name: 'Dedicación a I+D', listTitle: 'Dedicaciones I+D disponibles', newTitle: 'Agregar nueva dedicacion I+D'},
                    modality: {page:'position', type: 'modality', name: 'Modalidad', listTitle: 'Modalidades disponibles', newTitle: 'Agregar nueva modalidad'},
                    positionType: {page:'position', type: 'positionType', name: 'Tipo de Cargo', listTitle: 'Tipos de cargo disponibles', newTitle: 'Agregar nuevo tipo de cargo'},
                    secretaryshipDepartment:{page:'position', type: 'secretaryshipDepartment', name: 'Secretaría/Departamento', listTitle: 'Secretarias/Departamentos disponibles', newTitle: 'Agregar Secretaria/Departamento'},
                    subject: {page:'position', type: 'subject', name: 'Asignatura', listTitle: 'Asignaturas disponibles', newTitle: 'Agregar nueva asignatura'},
                    scholarshipType: {page:'formation', type: 'scholarshipType', name: 'Tipo de beca', listTitle: 'Tipos de beca', newTitle: 'Agregar nuevo tipo de beca'},
                    scholarshipName: {page:'formation', type: 'scholarshipName', name: 'Beca', listTitle: 'Becas', newTitle: 'Agregar nueva beca'},
                    tipoDeFormacion: {page:'formation', type: 'tipoDeFormacion', name: 'Tipo de Formación', listTitle: 'Tipos de Formación', newTitle: 'Agregar nuevo tipo de formación'},
                    gradoDeTitulacion: {page:'formation', type: 'gradoDeTitulacion', name: 'Grado de Titulación', listTitle: 'Grados de Titulación', newTitle: 'Agregar nuevo grado de titulación'},
                    organismoDeCategorizacion: {page:'formation', type: 'organismoDeCategorizacion', name: 'Organismo de Categorización', listTitle: 'Organismo de Categorización', newTitle: 'Agregar nuevo organizmo de categorización'},
                    categoria: {page:'formation', type: 'categoria', name: 'Categoría', listTitle: 'Categoría', newTitle: 'Agregar nueva categoría'},
                    tipoDeInvestigacion: {page:'projects', type: 'tipoDeInvestigacion', name: 'Tipo de Investigación', listTitle: 'Tipo de Investigación', newTitle: 'Agregar nuevo tipo de investigación'},
                    rol: {page:'participantes', type: 'rol', name: 'Rol', listTitle: 'Rol', newTitle: 'Agregar nuevo Rol'},
                };
            },
            saveParametric: function(parametricType, parametric, onSaved){
                dataService.saveObject('parametrics/'+ parametricType, parametric, onSaved);
            },
            removeParametric: function (parametricType, parametric) {
                if (parametric.id == null)
                    return;
                var referenceName = 'parametrics/'+ parametricType;
                dataService.deleteObject(referenceName, parametric);
            }
        };
    }
]);