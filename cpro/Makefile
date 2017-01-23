#
# Makefile for all
#

FE_DIR := $(realpath ./frontend)
SL_DIR := $(realpath ./servicelayer)
TE_DIR := $(realpath ./testexecutor)

RC_DODIR := $(realpath .)/do
R_STATE:= ra1xx
RELEASE:= 1.0
RC_DEST:= release_$(R_STATE)_$(RELEASE).tar.gz
FE_IDP := frontend.tar.gz
SL_IDP := servicelayer.tar.gz
TE_IDP := testexecutor.tar.gz

SUBDIRS := frontend servicelayer testexecutor
DODIRS  := $(addprefix do/, $(SUBDIRS))
DO_IDPS := $(addprefix do/, $(FE_IDP) $(SL_IDP) $(TE_IDP))

GCC := gcc

export RC_DODIR
export GCC

.PHONY: all $(SUBDIRS)
all: $(SUBDIRS)

$(SUBDIRS):
	$(MAKE) -C $@

node: deployment/node-1.tar.gz
	@-rm -rf $@
	tar xzf $<
	@touch $@

.PHONY: dist frontend_dist servicelayer_dist testexecutor_dist do_clean
do_clean:
	@echo "clean all stuff"
	-rm do/ -rf

dist: do_clean $(RC_DODIR) $(RC_DEST)
	@echo "test make in makefile"

st_dist:
	$(MAKE) dist

$(RC_DODIR):
	@mkdir -p $(RC_DODIR)

$(RC_DEST): $(DO_IDPS)
	@echo "Make dist tar package"

#------------------------------------------------------
do/$(FE_IDP): frontend/$(FE_IDP)
	mkdir -p do/frontend
	(cd do/frontend && tar xfz $(FE_DIR)/$(FE_IDP) || exit "$$?")
	(cd $(RC_DODIR) && tar cfz $(FE_IDP) frontend/ || exit "$$?")
	-@rm -rf do/frontend

frontend/$(FE_IDP): frontend_dist
	touch $@

frontend_dist:
	$(MAKE) -C frontend


#------------------------------------------------------
do/$(SL_IDP): servicelayer/$(SL_IDP)
	mkdir -p do/servicelayer
	(cd do/servicelayer && tar xfz $(SL_DIR)/$(SL_IDP) || exit "$$?")
	(cd $(RC_DODIR) && tar cfz $(SL_IDP) servicelayer/ || exit "$$?")
	-@rm -rf do/servicelayer

servicelayer/$(SL_IDP): servicelayer_dist
	touch $@

servicelayer_dist:
	$(MAKE) -C servicelayer

#------------------------------------------------------
do/$(TE_IDP): testexecutor/$(TE_IDP)
	mkdir -p do/testexecutor
	(cd do/testexecutor && tar xfz $(TE_DIR)/$(TE_IDP) || exit "$$?")
	(cd $(RC_DODIR) && tar cfz $(TE_IDP) testexecutor/ || exit "$$?")
	-@rm -rf do/testexecutor

testexecutor/$(TE_IDP): testexecutor_dist
	touch $@

testexecutor_dist:
	$(MAKE) -C testexecutor 

.PHONY: clean
clean:
	@(for d in $(SUBDIRS); do \
	$(MAKE) -C $$d $@ || exit "$$?";\
	done)
	-rm -rf do/

.PHONY: realclean
realclean:
	@(for d in $(SUBDIRS); do \
	$(MAKE) -C $$d $@ || exit "$$?";\
	done)
	-rm -rf do/
