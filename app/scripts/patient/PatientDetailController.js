/* jshint bitwise: false, camelcase: false, curly: true, eqeqeq: true, globals: false, freeze: true, immed: true, nocomma: true, newcap: true, noempty: true, nonbsp: true, nonew: true, quotmark: true, undef: true, unused: true, strict: true, latedef: nofunc */

/* globals angular */

(function () {
    "use strict";

    angular
        .module("TracsClient.controllers")
        .controller("PatientDetailController", PatientDetailController);

    PatientDetailController.$inject = ["$state", "$cordovaToast", "$ionicHistory", "storage", "PatientFactory", "MenuFactory"];

    function PatientDetailController($state, $cordovaToast, $ionicHistory, storage, PatientFactory, MenuFactory) {

        var vm = this;

        vm.patient = {};
        vm.patientOpinions = {};
        vm.isInfoTab = false;

        vm.updatePatientGeneralInfo = function () {
            var updatedPatient = vm.patient;

            PatientFactory.updatePatientGeneralInfo(updatedPatient).then(function () {
                $cordovaToast.showLongBottom("Información general del paciente actualizada correctamente!").then(function () {
                    MenuFactory.clearRightButtonAction();
                    $state.reload();
                });
            }, function () {
                $cordovaToast.showLongBottom("Ocurrió un error al editar la información general del paciente, intentalo de nuevo");
            });

        };

        vm.addPatientOpinion = function () {
            var currentUserId = storage.getUser()._id,
                newPatientOpinion = {};

            newPatientOpinion.user = currentUserId;
            newPatientOpinion.description = vm.patientOpinion;

            if (newPatientOpinion.description) {

                PatientFactory.addPatientOpinion(newPatientOpinion, vm.patient._id).then(function () {
                    $cordovaToast.showLongBottom("Nueva opinión gurdada correctamente!");
                    $state.reload();
                }, function () {
                    $cordovaToast.showLongBottom("Ocurrió un error al guardar la opinión del paciente, intentalo de nuevo");
                });
            } else{
                $cordovaToast.showLongBottom("Complete su opinion antes de submitir");
            }
        };

        vm.updatePatientContactInfo = function () {
            PatientFactory.updatePatientContactInfo(vm.patient.contactInfo, vm.patient._id).then(function () {
                $cordovaToast.showLongBottom("Información general del paciente actualizada correctamente!").then(function () {
                    MenuFactory.clearRightButtonAction();
                    //$state.go("app.patientWall", { id: vm.patient._id });
                    $state.reload();
                });
            }, function () {
                $cordovaToast.showLongBottom("Ocurrió un error al editar la información de contacto del paciente, intentalo de nuevo");
            });
        };

        vm.changeToGeneralTab = function () {
            vm.editOn = false;

            MenuFactory.clearRightButtonAction();

            MenuFactory.activateRightEditButtonAction(function () {
                vm.editGeneralTab();
            });
        };

        vm.changeToContactInfoTab = function () {

            vm.editOn = false;
            vm.isInfoTab = true;

            MenuFactory.clearRightButtonAction();

            if (vm.patient.contactInfo) {
                MenuFactory.activateRightEditButtonAction(function () {
                    vm.editContactInfoTab();
                });
            }

        };

        vm.changeToOpinionsTab = function () {

            console.log(vm.profile.isParent);
            MenuFactory.clearRightButtonAction();

            MenuFactory.activateRightButtonAction(function () {
                vm.addPatientOpinion();
            });
        };

        vm.editGeneralTab = function () {
            vm.editOn = true;

            MenuFactory.clearRightButtonAction();

            MenuFactory.activateRightButtonAction(function () {
                vm.updatePatientGeneralInfo();
            });
        };

        vm.editContactInfoTab = function () {
            vm.editOn = true;
            v
            MenuFactory.clearRightButtonAction();

            MenuFactory.activateRightButtonAction(function () {
                vm.updatePatientContactInfo();
            });
        };

        vm.isParent = function(){
            return vm.profile.isParent;
        }


        function activate() {

            vm.patient = storage.getLastVisitedPatient();
            vm.profile = storage.getCurrentProfile();

            vm.changeToGeneralTab();
            console.log(vm.profile.isParent);

            // Cuando apretamos atrás se borra el check y su funcionalidad
            MenuFactory.setBackButtonAction(function () {
                MenuFactory.clearRightButtonAction();
            });

            PatientFactory.getPatientDetail(vm.patient._id).then(function (resultPatient) {
                vm.patient = resultPatient;
            }, function () {
                $cordovaToast.showLongBottom("Ocurrió un error al recuperar la información del paciente, intentalo de nuevo");
            });

            PatientFactory.getPatientOpinions(vm.patient._id).then(function (result) {
                vm.patientOpinions = result;
            }, function () {
                $cordovaToast.showLongBottom("Ocurrió un error al recuperar las opiniones del paciente, intentalo de nuevo");
            });
        }

        activate();
    }
})();
